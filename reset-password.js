import { auth } from './firebase-config.js';
import { confirmPasswordReset, verifyPasswordResetCode } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', async () => {
    const resetPasswordForm = document.getElementById('reset-password-form');
    const alertBox = document.getElementById('alert-box');
    const submitBtn = document.getElementById('submit-btn');
    
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    
    const confirmPasswordInput = document.getElementById('confirm-password');
    const toggleConfirmPasswordBtn = document.getElementById('toggle-confirm-password');

    // Get oobCode from URL
    const urlParams = new URLSearchParams(window.location.search);
    const oobCode = urlParams.get('oobCode');

    function showAlert(message, type) {
        alertBox.innerText = message;
        alertBox.className = `admin-alert alert-${type}`;
        alertBox.style.display = 'block';
    }

    if (!oobCode) {
        showAlert('Invalid or missing password reset code. Please request a new reset link.', 'error');
        if (submitBtn) submitBtn.disabled = true;
    } else {
        try {
            // Verify the reset code and get the user's email
            const email = await verifyPasswordResetCode(auth, oobCode);
            // Optionally, we could display this email on the UI: "Resetting password for " + email
        } catch (error) {
            console.error(error);
            showAlert('Invalid or expired password reset code. Please request a new link.', 'error');
            if (submitBtn) submitBtn.disabled = true;
        }
    }

    // Toggle password visibility
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
        });
    }

    if (toggleConfirmPasswordBtn && confirmPasswordInput) {
        toggleConfirmPasswordBtn.addEventListener('click', () => {
            const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', type);
        });
    }

    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!oobCode) {
                showAlert('Invalid or missing password reset code.', 'error');
                return;
            }

            alertBox.className = 'admin-alert hidden';
            
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (password !== confirmPassword) {
                showAlert('Passwords do not match.', 'error');
                return;
            }
            if (password.length < 8) {
                showAlert('Password must be at least 8 characters long.', 'error');
                return;
            }

            submitBtn.disabled = true;
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span>Updating...</span>`;

            try {
                await confirmPasswordReset(auth, oobCode, password);
                showAlert('Password has been reset successfully! Redirecting to login...', 'success');
                resetPasswordForm.reset();
                
                setTimeout(() => {
                    window.location.href = '/admin/login';
                }, 2000);
            } catch (error) {
                console.error(error);
                showAlert('Failed to reset password. The link might be expired or invalid. ' + error.message, 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }
        });
    }
});
