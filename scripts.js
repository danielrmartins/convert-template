// Função para obter a cotação atual das moedas.
async function getCurrencyRates() {
  try {
    const response = await fetch("https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,GBP-BRL");
    const data = await response.json();

    return {
      USD: parseFloat(data.USDBRL.bid),
      EUR: parseFloat(data.EURBRL.bid),
      GBP: parseFloat(data.GBPBRL.bid),
    };
  } catch (error) {
    console.log("Erro ao buscar as cotações: ", error);
    alert("Não foi possível obter as cotações. Tente novamente mais tarde.");
    return {
      USD: 4.87,  // valores padrão em caso de erro
      EUR: 5.32,
      GBP: 6.08,
    };
  }
}

// Função principal para inicializar a aplicação
async function init() {
  // Obtenha as cotações atuais
  const rates = await getCurrencyRates();

  // Obtendo os elementos do formulário.
  const form = document.querySelector("form");
  const amount = document.getElementById("amount");
  const currency = document.getElementById("currency");
  const footer = document.querySelector("main footer");
  const description = document.getElementById("description");
  const result = document.getElementById("result");

  // Manipulando o input amount para receber somente números.
  amount.addEventListener("input", () => {
    const hasCharactersRegex = /\D+/g;
    amount.value = amount.value.replace(hasCharactersRegex, "");
  });

  // Captando o evento de submit (enviar) do formulário.
  form.onsubmit = (event) => {
    event.preventDefault();

    switch (currency.value) {
      case "USD":
        convertCurrency(amount.value, rates.USD, "US$");
        break;
      case "EUR":
        convertCurrency(amount.value, rates.EUR, "€");
        break;
      case "GBP":
        convertCurrency(amount.value, rates.GBP, "£");
        break;
    }
  };

  // Função para converter a moeda.
  function convertCurrency(amount, price, symbol) {
    try {
      // Exibindo a cotação da moeda selecionada.
      description.textContent = `${symbol} 1 = ${formatCurrencyBRL(price)}`;

      // Calcula o total.
      let total = amount * price;

      // Exibe o resultado total.
      result.textContent = formatCurrencyBRL(total);

      // Aplica a classe que exibe o footer para mostrar o resultado.
      footer.classList.add("show-result");
    } catch (error) {
      // Remove a classe do footer removendo ele da tela.
      footer.classList.remove("show-result");

      console.log(error);
      alert("Não foi possível converter. Tente novamente mais tarde.");
    }
  }

  // Formata a moeda em Real Brasileiro.
  function formatCurrencyBRL(value) {
    // Converte para número para utilizar o toLocaleString para formatar no padrão BRL (R$ 00,00).
    return Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
}

// Inicia o script
init();