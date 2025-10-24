const menuIcon = document.querySelector('.menu-e-logo img:first-child');
  const menuLateral = document.getElementById('menu-lateral');
  const btnFechar = document.querySelector('.btn-fechar');
  const overlay = document.querySelector('.overlay');
  const categoriaHeader = document.querySelector('.categoria-header');
  const categoria = document.querySelector('.categoria');

  // Abrir menu
  menuIcon.addEventListener('click', () => {
    menuLateral.classList.add('ativo');
    overlay.classList.add('ativo');
  });

  // Fechar menu
  const fecharMenu = () => {
    menuLateral.classList.remove('ativo');
    overlay.classList.remove('ativo');
    categoria.classList.remove('ativo'); // fecha submenu também
  };

  btnFechar.addEventListener('click', fecharMenu);
  overlay.addEventListener('click', fecharMenu);

  // Alternar submenu ao clicar em "Categorias"
  categoriaHeader.addEventListener('click', () => {
    categoria.classList.toggle('ativo');
  });