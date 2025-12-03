const http = require('http');
const { exec } = require('child_process');
const crypto = require('crypto');

// 配置
const PORT = 9000;  // Webhook 监听端口
const SECRET = 'your-webhook-secret';  // GitHub Webhook Secret（需要设置）
const UPDATE_SCRIPT = '/path/to/vps-auto-update.sh';  // 更新脚本路径

// 验证 GitHub Webhook 签名
function verifySignature(payload, signature) {
    if (!signature) return false;

    const hmac = crypto.createHmac('sha256', SECRET);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(digest)
    );
}

// 执行更新脚本
function runUpdateScript() {
    console.log('[' + new Date().toISOString() + '] 执行更新脚本...');

    exec(`bash ${UPDATE_SCRIPT}`, (error, stdout, stderr) => {
        if (error) {
            console.error('更新失败:', error);
            return;
        }
        console.log('更新输出:', stdout);
        if (stderr) console.error('错误输出:', stderr);
    });
}

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/webhook') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const signature = req.headers['x-hub-signature-256'];

            // 验证签名
            if (!verifySignature(body, signature)) {
                console.error('[' + new Date().toISOString() + '] 签名验证失败');
                res.writeHead(401);
                res.end('Unauthorized');
                return;
            }

            // 解析 payload
            const payload = JSON.parse(body);

            // 检查是否是 push 事件
            if (req.headers['x-github-event'] === 'push') {
                console.log('[' + new Date().toISOString() + '] 收到 GitHub push 事件');
                console.log('提交信息:', payload.head_commit?.message);

                // 执行更新
                runUpdateScript();

                res.writeHead(200);
                res.end('OK');
            } else {
                res.writeHead(200);
                res.end('Event ignored');
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Webhook 服务器运行在端口 ${PORT}`);
    console.log('等待 GitHub Webhook 事件...');
});
