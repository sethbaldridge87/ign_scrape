$(document).ready(function(){
    $('.articleSave').click(function(){
        var title = $(this).closest('div').find('h2').text();
        var score = $(this).closest('div').find('h5').text();
        var link = $(this).closest('div').find('span').text();
        var article = {
            title: title,
            score: score,
            link: link
        };
        $.ajax("/submit", {
            type: "POST",
            data: article
        }).then(
            function() {

            }
        )
        location.reload();
    });
    $('.submit_comment').click(function(){
        var text = $(this).closest('div').find('.comment').val().trim();
        var article = $(this).closest('.article').find('h3').text();
        var comment = {
            text:text,
            article:article
        }
        $.ajax("/comment", {
            type: "POST",
            data: comment
        }).then(
            function(){
                location.reload();
            }
        )
        location.reload();
    });
    $('.delete_comment').click(function(){
        var text = $(this).closest('div').find('p').text();
        var id = $(this).closest('.article').attr('data-id');
        var comment = {
            text:text,
            articleID:id
        }
        $.ajax("/delete", {
            type: "DELETE",
            data: comment
        }).then(
            function(){
                location.reload();
            }
        )
        location.reload();
    });
});