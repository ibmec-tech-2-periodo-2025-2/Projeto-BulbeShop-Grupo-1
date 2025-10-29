// Script para funcionalidade das avaliações
document.addEventListener('DOMContentLoaded', function() {
    const addReviewBtn = document.querySelector('.add-review-btn');
    const reviewForm = document.getElementById('reviewForm');
    const stars = document.querySelectorAll('.star');
    const submitReviewBtn = document.querySelector('.submit-review');
    let currentRating = 0;
  
    // Alternar visibilidade do formulário de avaliação
    if (addReviewBtn) {
      addReviewBtn.addEventListener('click', function() {
        if (reviewForm.style.display === 'none' || reviewForm.style.display === '') {
          reviewForm.style.display = 'block';
          addReviewBtn.textContent = 'Cancelar';
        } else {
          reviewForm.style.display = 'none';
          addReviewBtn.textContent = '+ Adicionar Avaliação';
          resetForm();
        }
      });
    }
  
    // Sistema de avaliação por estrelas
    stars.forEach(star => {
      star.addEventListener('click', function() {
        const rating = parseInt(this.getAttribute('data-rating'));
        currentRating = rating;
        
        stars.forEach(s => {
          if (parseInt(s.getAttribute('data-rating')) <= rating) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
      });
    });
  
    // Enviar avaliação
    if (submitReviewBtn) {
      submitReviewBtn.addEventListener('click', function() {
        const reviewerName = document.getElementById('reviewerName').value;
        const reviewText = document.getElementById('reviewText').value;
        
        if (!reviewerName || !reviewText || currentRating === 0) {
          alert('Por favor, preencha todos os campos e selecione uma avaliação.');
          return;
        }
        
        // Adicionar nova avaliação à lista
        addNewReview(reviewerName, reviewText, currentRating);
        
        // Resetar formulário
        resetForm();
        reviewForm.style.display = 'none';
        addReviewBtn.textContent = '+ Adicionar Avaliação';
        
        alert('Avaliação enviada com sucesso!');
      });
    }
  
    // Função para adicionar nova avaliação
    function addNewReview(name, text, rating) {
      const reviewsContainer = document.querySelector('.reviews-section');
      const reviewCards = document.querySelectorAll('.review-card');
      const firstReviewCard = reviewCards[0];
      
      const newReview = document.createElement('div');
      newReview.className = 'review-card';
      
      const starsHTML = '★'.repeat(rating) + '☆'.repeat(5 - rating);
      
      newReview.innerHTML = `
        <div class="review-header">
          <span class="reviewer-name">${name}</span>
          <span class="review-date">Agora mesmo</span>
        </div>
        <div class="review-rating">${starsHTML}</div>
        <p class="review-text">${text}</p>
      `;
      
      // Inserir após o primeiro review card (antes do formulário)
      firstReviewCard.parentNode.insertBefore(newReview, firstReviewCard.nextSibling);
    }
  
    // Função para resetar o formulário
    function resetForm() {
      document.getElementById('reviewerName').value = '';
      document.getElementById('reviewText').value = '';
      currentRating = 0;
      
      stars.forEach(star => {
        star.classList.remove('active');
      });
    }
  });