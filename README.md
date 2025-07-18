<div align="center">

# uu-formatter

Format your text using extensively configurable, markdown-like syntax.
All processed locally on your device, with no data sent to any server.

</div>

## ⚡️ Quick start

You can access the app at [Github Pages][pages_url] for free, or run it locally.

## 🛠️ Local Setup

For local usage, it's recommended to use [Docker][docker_url] to run the app, which will handle all dependencies and setup for you.

```bash
docker run -p 3000:80 ghcr.io/plapcodes/uu-formatter:latest
```

After running the command, you can access the app at `http://localhost:3000`.

Should you prefer not to use Docker, you can run the app using [Node.js][node_url]. Install Node first, ideally the version labeled "LTS". When prompted with a question about adding it to PATH, agree. Then, clone the repository either by downloading the ZIP file (above the file list, a green button labeled "Code") or by running the following command in your terminal:

```bash
git clone https://github.com/plapcodes/uu-formatter.git
```

Once the project is downloaded on your device, navigate to the project directory in your terminal. If you're there in the file explorer on Windows, you can type `cmd` in the address bar to open a terminal in that directory, or right-click with Shift and select "Open PowerShell window here".

```bash
npm install
npm run dev
```

The terminal will show you the address where the app is running, usually `http://localhost:5173`. You can open this address in your web browser to access the app. When you close the terminal, the app will stop running.

## 🐛 Issues and Bugs

Should you encounter any issues or bugs, please first try to search for a similar issue in the [issues section][issues_url] or the [discussions section][discussions_url] of the repository. If you don't find a similar issue, you can create a new one. A template will guide you through the process of providing all necessary information to help resolve the issue.

## 🤝 Contributing

Despite my best efforts, this app's functionality is very much not perfect. If you deem yourself capable of improving it, please [discuss it][discussions_url] before writing any code, or especially if you don't plan to write any code at all, to help form the idea for the feature.

As long as the code is of similar or better quality than the existing codebase, your contributions will be accepted. Please try to make it readable, follow existing configuration (prettier and eslint), and test it a little. While I don't recommend vibe coding myself, I have nothing against it as long as the code isn't appalingly bad.

## 📜 License

This project is licensed under the [MIT License](LICENSE.md). You can use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, subject to the conditions outlined in the license.

<!-- Project -->

[issues_url]: https://github.com/plapcodes/uu-formatter/issues
[discussions_url]: https://github.com/plapcodes/uu-formatter/discussions
[pages_url]: https://plapcodes.github.io/uu-formatter/
[docker_url]: https://www.docker.com/
[node_url]: https://nodejs.org/
