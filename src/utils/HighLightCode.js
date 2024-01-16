function insertLineNumber(parentElement: any, codeElement: any) {
    const codeLines = codeElement.innerText.split('\n');
    const lineCount = codeLines.length;

    const lineNumbers = document.createElement('ul');
    lineNumbers.classList.add('hljs-code-number');

    for (let i = 1; i <= lineCount; i++) {
        const listItem = document.createElement('li');
        listItem.innerText = i.toString();
        lineNumbers.appendChild(listItem);
    }

    parentElement.insertBefore(lineNumbers, codeElement);
}

function insertCopyButton(parentElement: any, codeElement: any) {
    const copyButton = document.createElement('div');
    copyButton.classList.add('hljs-copy');
    copyButton.innerText = '复制';

    copyButton.addEventListener('click', () => {
        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);
        textarea.setAttribute('readonly', 'readonly');
        textarea.value = codeElement.innerText;
        textarea.select();

        if (document.execCommand('copy')) {
            copyButton.innerText = '复制成功';
        }

        document.body.removeChild(textarea);
    });

    copyButton.style.display = 'none';
    copyButton.addEventListener('mouseover', () => {
        copyButton.style.display = 'block';
    });
    copyButton.addEventListener('mouseout', () => {
        copyButton.style.display = 'none';
        copyButton.innerText = '复制';
    });

    parentElement.appendChild(copyButton);
}

export default HighLightCode;
