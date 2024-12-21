<script>
    function() {
        document.querySelectorAll('.favorite-btn').forEach(button => {
            button.addEventListener('click', function() {
                this.classList.toggle('active');
            });
        })}
</script>