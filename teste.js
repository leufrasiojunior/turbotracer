// Definindo valores de exemplo
const page = 5; // Mude este valor para testar diferentes páginas
const take = 10; // Mude este valor para testar diferentes valores de take
const results = [{ id: 17155 }]; // Mude este valor para testar diferentes ids

// Verificação e cálculo de mycursor
if (results.length > 0 && typeof results[0].id === 'number') {
    const calculatedValue = results[0].id - ((page - 1) * take);
    const mycursor = Math.max(0, calculatedValue);
  
  // Log para verificar o valor calculado antes de aplicar Math.max
  console.log('Calculated Value:', calculatedValue);
  console.log('Mycursor:', mycursor);
} else {
  console.error('Erro: results está vazio ou results[0].id não é um número');
}
