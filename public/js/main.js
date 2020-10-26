// alert('Hi there');

/*
*   Jquery
*/
$(document).ready(function() {
    $('.deleteUser').on('click', deleteUser);

    $(".form-toggle").click(function(){
    $(".add-form").toggle();
  });
});


/*
*   Vanila JS
*/
function onLoad() {
    document.querySelector('.add-form').style.display ='none';
}

function deleteUser() {
    var confirmation = confirm('Are you sure?');
    if (confirmation) {
        // alert('deleted');
        $.ajax({
            type: 'DELETE',
            url: 'users/delete/'+$(this).data('id')
        }).done(function(resp) {
            // window.location.replace('/');
        });
        window.location.replace('/');
    } else {
        return false;
    }
}
