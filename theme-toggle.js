document.addEventListener("DOMContentLoaded", function() {
  // Get checkbox and label elements
  const themeSwitch = document.querySelector('.theme-switch');
  const themeIcon = document.querySelector('.theme-icon');
  
  // Initialize theme based on local storage or default to light
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.getElementById('theme-style').href = `${currentTheme}.css`;
  themeIcon.className = currentTheme === 'light' ? 'fas fa-sun theme-icon' : 'fas fa-moon theme-icon';
  
  // Event listener for checkbox to toggle theme
  themeSwitch.addEventListener('change', function() {
    const newTheme = themeSwitch.checked ? 'dark' : 'light';
    themeIcon.className = newTheme === 'light' ? 'fas fa-sun theme-icon' : 'fas fa-moon theme-icon';
    document.getElementById('theme-style').href = `${newTheme}.css`;
    localStorage.setItem('theme', newTheme);
  });
});

$(document).ready(function() {
  $('.abstract-toggle').click(function() {
    $(this).next('.abstract-content').slideToggle(); // next() finds the immediately following sibling
  });
});

