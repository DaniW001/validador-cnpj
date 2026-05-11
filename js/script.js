const input = document.getElementById('cnpj');
const button = document.getElementById('validate-btn');
const message = document.getElementById('message');

function aplicarMascara(valor) {
    let v = valor.replace(/[^A-Z0-9]/gi, '').toUpperCase();

    v = v.substring(0, 14);

    if (v.length > 12) {
        v = v.replace(/^(\w{2})(\w{3})(\w{3})(\w{4})(\w{0,2}).*/, '$1.$2.$3/$4-$5');
    } else if (v.length > 8) {
        v = v.replace(/^(\w{2})(\w{3})(\w{3})(\w{0,4}).*/, '$1.$2.$3/$4');
    } else if (v.length > 5) {
        v = v.replace(/^(\w{2})(\w{3})(\w{0,3}).*/, '$1.$2.$3');
    } else if (v.length > 2) {
        v = v.replace(/^(\w{2})(\w{0,3}).*/, '$1.$2');
    }

    return v;
}

function charParaValor(char) {
    return char.charCodeAt(0) - 48;
}

function calcularDigito(chars, pesos) {
    const soma = chars.reduce((acc, ch, i) => acc + charParaValor(ch) * pesos[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
}

function validarCNPJAlfanumerico(cnpj) {
    const c = cnpj.replace(/[^A-Z0-9]/gi, '').toUpperCase();

    if (c.length !== 14) return false;
    if (/^(.)\1+$/.test(c)) return false;
    if (!/^[A-Z0-9]{12}[0-9]{2}$/.test(c)) return false;

    const pesosD1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const pesosD2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const d1 = calcularDigito(c.substring(0, 12).split(''), pesosD1);
    const d2 = calcularDigito(c.substring(0, 13).split(''), pesosD2);

    return d1 === parseInt(c[12], 10) && d2 === parseInt(c[13], 10);
}

function mostrarMensagem(texto, tipo) {
    message.textContent = texto;
    message.className = 'message';
    void message.offsetWidth;
    message.classList.add(tipo);
}

function ocultarMensagem() {
    message.className = 'message';
}

button.addEventListener('click', () => {
    const valor = input.value.trim();

    if (valor === '') {
        mostrarMensagem('⚠ Por favor, digite um CNPJ.', 'error');
        input.focus();
        return;
    }

    const valido = validarCNPJAlfanumerico(valor);

    if (valido) {
        mostrarMensagem('✔ CNPJ válido!', 'success');
    } else {
        mostrarMensagem('✖ CNPJ inválido. Verifique os dados e tente novamente.', 'error');
    }
});

input.addEventListener('input', (event) => {
    const posicaoAntes = event.target.selectionStart;
    const valorAntes = event.target.value;

    event.target.value = aplicarMascara(event.target.value);

    ocultarMensagem();
});

input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        button.click();
    }
});

input.addEventListener('paste', (event) => {
    event.preventDefault();
    const colado = (event.clipboardData || window.clipboardData).getData('text');
    const posicao = input.selectionStart;
    const atual = input.value;
    const novo = atual.substring(0, posicao) + colado + atual.substring(input.selectionEnd);
    input.value = aplicarMascara(novo);
    ocultarMensagem();
});