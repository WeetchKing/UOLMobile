!function() {
    if (!$ && jQuery) var $ = jQuery;
    var start_time, end_time, currentjob, currentjob_detail_1, currentjob_detail_2;

    function load_data(id, type, name) {
        window.history.pushState("", "", "#_" + type + "_" + id), "360" === id && (id = 43);
        var url = "api/vt_api.php?url=http://forum.jogos.uol.com.br/_" + type + "_" + id;
        $.ajax({
            url,
            dataType: "json",
            async: !0,
            type: "GET",
            beforeSend: () => {
                start_time = new Date().getTime(), show_debug_info("Loading '" + name + "'");
            },
            success: function(data) {
                if (data.hasOwnProperty("err")) return clean_maincontainer("error_list_container"), 
                $("#maincontainer").append('<div id="error_list_container"><div class="title toolbar">Erro</div><br><b>An Error Ocurred:</b><br>Error Name: ' + data.err.err_name + "<br>Error Message: " + data.err.err_message + "<br>Date: " + data.err.err_date + "</div>"), 
                $(".backButton").length ? $(".backButton").click(function() {
                    $(this).unbind("click"), show_forums();
                }) : $("#lastPageButton").length ? $("#lastPageButton").remove() : ($(".maintoolbar").append('<a class="backButton" href="javascript:void(0)"><span>Índice</span></a>'), 
                $(".backButton").click(function() {
                    $(this).unbind("click"), show_forums();
                })), $("html").show(), end_time = new Date().getTime() - start_time, void show_debug_info(data.err.err_name);

                if ("f" == type) {
                    id;
                    var forum_name = data.thread_list.forum_name, online_users = $(data.thread_list.online_users).each(function() {
                        var url = $(this).find("a").attr("href");
                        $(this).find("a").attr("href", "http://forum.jogos.uol.com.br" + url);
                    }).html();
                    clean_maincontainer("thread_list_container"), $(".backButton").remove(), $(".rightButton").remove(), 
                    $(".centerButton").remove(), $(".maintoolbar").append('<a class="backButton" href="javascript:void(0)"><span>Índice</span></a>'), 
                    $("#bottomtoolbar").append('<a class="backButton" href="javascript:void(0)"><span>Índice</span></a>'), 
                    $(".maintoolbar").append('<a id="refreshForumButton" class="rightButton" href="javascript:void(0)"><span>Atualizar</span></a>'), 
                    $("#maincontainer").html('<div id="thread_list_container"></div>'), $("#maincontainer").find("#thread_list_container").append('<div class="titleDiv"></div>'), 
                    $("#maincontainer").find("#thread_list_container").append('<div class="title toolbar">Tópicos</div>'), 
                    $("#maincontainer").find("#thread_list_container").append('<table class="list"><tbody>'), 
                    $("#maincontainer").find("#thread_list_container").find(".titleDiv").text(forum_name), 
                    $("#maincontainer").find("#thread_list_container").after('<div class="title toolbar">Usuários online</div><span class="totalPages usersOnline"><div class="texto">' + online_users + "</div></span>");
                    for (var i = 0; i < data.thread_list.all_threads.thread.length; i++) {
                        var title = data.thread_list.all_threads.thread[i].title, author = data.thread_list.all_threads.thread[i].author, author_url = data.thread_list.all_threads.thread[i].author_url, replies = data.thread_list.all_threads.thread[i].replies, pages = "";
                        pages = replies.replace(".", "") > 20 ? "&#x7E;" + Math.round(replies.replace(".", "") / 20) : 1;
                        data.thread_list.all_threads.thread[i].views, data.thread_list.all_threads.thread[i].last_message;
                        to_append = '<tr><td><a href="javascript:void(0)" data-threadid="' + (global_id = data.thread_list.all_threads.thread[i].global_id) + '" class="threadItem">' + title + '<br><span class="totalPages">' + author + "<br>" + replies + " Respostas<br>" + pages + ' P&#xE1;ginas</span></a></td><td><a href="javascript:void(0)" data-threadid="' + global_id + '" class="threadItemArrow"></a></td></tr>', 
                        $("#maincontainer").find("#thread_list_container").find(".list").append(to_append);
                    }
                    $("#maincontainer").find("#thread_list_container").append("</tbody></table>"), $("#refreshForumButton").click(function() {
                        $(this).unbind("click"), load_data(id, "f", forum_name);
                    }), $(".backButton").click(function() {
                        $(this).unbind("click"), show_forums();
                    }), $("#maincontainer").find("#thread_list_container").find(".list").find("tbody").find("tr").find("td").click(function() {
                        load_data($(this).find("a").attr("data-threadid"), "t", $(this).find("a").justtext());
                    }), end_time = new Date().getTime() - start_time, show_debug_info("Loaded '" + forum_name + "'", end_time);
                }
                
                if ("t" == type) {
                    var forum_id = forum_url_clear(data.post_list.forum_id, "f"), thread_name = (forum_name = data.post_list.forum_name, 
                    $.trim(data.post_list.thread_name)), thread_posts_in_page = ($.trim(data.post_list.thread_date), 
                    data.post_list.thread_posts_in_page), thread_current_page = data.post_list.thread_cur_page, thread_last_page = data.post_list.thread_last_page;
                    online_users = $(data.post_list.online_users).each(function() {
                        var url = $(this).find("a").attr("href");
                        $(this).find("a").attr("href", "http://forum.jogos.uol.com.br" + url);
                    }).html();
                    if (forum_url_clear(data.post_list.forum_id, "f"), id, thread_name, clean_maincontainer("post_list_container"), 
                    $(".backButton").remove(), $(".rightButton").remove(), $(".centerButton").remove(), 
                    $("#bottomtoolbar").append('<a class="backButton" href="javascript:void(0)"><span>Fórum</span></a>'), 
                    $("#bottomtoolbar").append('<a id="nextPageButton" class="rightButton" href="javascript:void(0)"><span>Próx. Pág.</span></a>'), 
                    $(".maintoolbar").append('<a class="backButton" href="javascript:void(0)"><span>Fórum</span></a>'), 
                    $(".maintoolbar").append('<a id="lastPageButton" class="rightButton" href="javascript:void(0)"><span>Últ. Pág.</span></a>'), 
                    $("#maincontainer").html('<div id="post_list_container"></div>'), $("#maincontainer").find("#post_list_container").append('<div class="titleDiv"></div>'), 
                    $("#maincontainer").find("#post_list_container").append('<table class="posts"><tbody>'), 
                    $("#maincontainer").find("#post_list_container").find(".titleDiv").html(thread_name + '<br><span class="titlePages">Página ' + thread_current_page + " de " + thread_last_page + " </span>"), 
                    $("#maincontainer").find("#post_list_container").after('<div class="title toolbar">Usuários online</div><span class="totalPages usersOnline"><div class="texto">' + online_users + "</div></span>"), 
                    "1" === thread_posts_in_page) {
                        var global_id = data.post_list.all_posts.post.global_id, text = (author = data.post_list.all_posts.post.username, 
                        data.post_list.all_posts.post.message), avatar_url = (author_url = "http://forum.jogos.uol.com.br/" + decodeURIComponent(data.post_list.all_posts.post.profile_url), 
                        decodeURIComponent(data.post_list.all_posts.post.avatar_url)), totalposts = data.post_list.all_posts.post.total_posts, registration_date = data.post_list.all_posts.post.register_date;
                        data.post_list.all_posts.post.user_level;
                        to_append = '<tr><td class="poster"><div class="avatar"><a href="' + author_url + '"><img class="avatar2" src="' + avatar_url + '"></a></div><div class="posterInfo"><span class="nick">' + author + '</span><br><span class="postcount">Mensagens: <b>' + totalposts + "</b><br>Cadastro: <b>" + registration_date + "</b></span></div></td></tr>", 
                        to_append += '<tr><td class="postContent">' + text + "</td></tr>", $("#maincontainer").find("#post_list_container").find(".posts").append(to_append);
                    } else for (i = 0; i < data.post_list.all_posts.post.length; i++) {
                        var to_append;
                        global_id = data.post_list.all_posts.post[i].global_id, author = data.post_list.all_posts.post[i].username, 
                        text = data.post_list.all_posts.post[i].message, author_url = "http://forum.jogos.uol.com.br/" + decodeURIComponent(data.post_list.all_posts.post[i].profile_url), 
                        avatar_url = decodeURIComponent(data.post_list.all_posts.post[i].avatar_url), totalposts = data.post_list.all_posts.post[i].total_posts, 
                        registration_date = data.post_list.all_posts.post[i].register_date, data.post_list.all_posts.post[i].user_level;
                        to_append = '<tr><td class="poster"><div class="avatar"><a href="' + author_url + '"><img class="avatar2" src="' + avatar_url + '"></a></div><div class="posterInfo"><span class="nick">' + author + '</span><br><span class="postcount">Mensagens: <b>' + totalposts + "</b><br>Cadastro: <b>" + registration_date + "</b></span></div></td></tr>", 
                        to_append += '<tr><td class="postContent">' + text + "</td></tr>", $("#maincontainer").find("#post_list_container").find(".posts").append(to_append);
                    }
                    $("#maincontainer").find("#post_list_container").append("</tbody></table>"), $(".texto").each(function() {
                        var youtubeDetected = !1, youtubeVideoID = "";
                        $(this).find("center").find("object").find("embed").each(function() {
                            -1 != $(this).attr("src").indexOf("youtube") && (youtubeDetected = !0, youtubeVideoID = (youtubeVideoID = (youtubeVideoID = (youtubeVideoID = $(this).attr("src")).replace("https://www.youtube.com/v/", "")).replace("http://www.youtube.com/v/", "")).replace("&hl=en&fs=1", "")), 
                            youtubeDetected && ($(this).parent().append('<iframe style="max-width: 300px;" src="//www.youtube-nocookie.com/embed/' + youtubeVideoID + '" frameborder="0" allowfullscreen></iframe>'), 
                            $(this).remove());
                        });
                    }), $("#bottomtoolbar").append('<a class="centerButton" href="javascript:void(0)"><span>Pág. ' + thread_current_page + " de " + thread_last_page + "</span></a>"), 
                    $(".backButton").click(function() {
                        $(this).unbind("click"), load_data(forum_id, "f", forum_name);
                    }), $("#lastPageButton").click(function() {
                        $(this).unbind("click"), load_data(id + "?page=" + thread_last_page, "t", thread_name);
                    }), $(".centerButton").click(() => {
                        var user_input = prompt("Digite a página desejada\n\n(De 1 a " + thread_last_page + ")", "");
                        user_input > thread_last_page || null === user_input || "" === user_input || isNaN(user_input) || load_data(id + "?page=" + user_input, "t", thread_name);
                    }), $("#nextPageButton").click(() => {
                        Math.round(thread_current_page++) < thread_last_page && load_data(id + "?page=" + thread_current_page++, "t", thread_name);
                    }), end_time = new Date().getTime() - start_time, show_debug_info("Loaded '" + thread_name + "'", end_time);
                }
                $(window).scrollTop(0);
            },
            error: xhr => {
                end_time = new Date().getTime() - start_time, show_debug_info("'" + xhr.statusText + "'", end_time), 
                xhr.statusText, "Not Found" == xhr.statusText && show_debug_info("Invalid URL", end_time);
            }
        }), $("html").show();
    }
    //////////////////////
    function clean_maincontainer(newappend) {
        var start_time2 = new Date().getTime();
        $("#maincontainer").find("#" + newappend).length || $("#maincontainer").children().remove(), 
        show_debug_info('Cleaned maincontainer (New: "' + newappend + '"")', new Date().getTime() - start_time2);
    }
    //////////////////////
    function show_debug_info(message, endtime) {
        if (endtime) return endtime > 999 ? endtime = Math.round(endtime / 1e3) + "s" : endtime += "ms", 
        void $("#status").find("h1").text(message + " (" + endtime + ")");
        $("#status").find("h1").text(message);
    }
    //////////////////////
    function show_forums() {
        var start_time3 = new Date().getTime();
        window.history.pushState("", "", " "), clean_maincontainer("forum_list_container"), 
        $(".backButton").remove(), $(".rightButton").remove(), $(".centerButton").remove(), 
        $("#maincontainer").html('<div id="forum_list_container"><div class="title">Geral</div><table class="list"><tr><td><a href="javascript:void(0)" data-forumid="56" class="threadItem">Not&iacute;cias<br><span class="totalPages">Comente as novidades da semana</span></a></td><td><a href="javascript:void(0)" data-forumid="56" class="threadItemArrow"></a></td></tr></table><div class="title">Jogos e Consoles</div><table class="list"><tr><td><a href="javascript:void(0)" data-forumid="39" class="threadItem">DS, Wii<br><span class="totalPages">Dicas, an&aacute;lises e jogos da Nintendo</span></a></td><td><a href="javascript:void(0)" data-forumid="39" class="threadItemArrow"></a></td></tr><tr><td><a href="javascript:void(0)" data-forumid="40" class="threadItem">PC<br><span class="totalPages">Dicas, an&aacute;lises e jogos para computadores</span></a></td><td><a href="javascript:void(0)" data-forumid="40" class="threadItemArrow"></a></td></tr><tr><td><a href="javascript:void(0)" data-forumid="41" class="threadItem">Playstation, PSP<br><span class="totalPages">Dicas, an&aacute;lises e jogos da Sony</span></a></td><td><a href="javascript:void(0)" data-forumid="41" class="threadItemArrow"></a></td></tr><tr><td><a href="javascript:void(0)" data-forumid="43" class="threadItem">Xbox, Xbox 360<br><span class="totalPages">Dicas, an&aacute;lises e jogos da Microsoft</span></a></td><td><a href="javascript:void(0)" data-forumid="43" class="threadItemArrow"></a></td></tr></table><div class="title">Fora de T&oacute;pico</div><table class="list"><tr><td><a href="javascript:void(0)" data-forumid="51" class="threadItem">Cinema<br><span class="totalPages">Filmes, estreias da semana, DVDs...</span></a></td><td><a href="javascript:void(0)" data-forumid="51" class="threadItemArrow"></a></td></tr><tr><td><a href="javascript:void(0)" data-forumid="54" class="threadItem">M&uacute;sica<br><span class="totalPages">Bandas, rock, samba e tudo mais</span></a></td><td><a href="javascript:void(0)" data-forumid="54" class="threadItemArrow"></a></td></tr><tr><td><a href="javascript:void(0)" data-forumid="55" class="threadItem">Papo-cabe&ccedil;a<br><span class="totalPages">Arte, filosofia e literatura</span></a></td><td><a href="javascript:void(0)" data-forumid="55" class="threadItemArrow"></a></td></tr><tr><td><a href="javascript:void(0)" data-forumid="57" class="threadItem">Vale Tudo<br><span class="totalPages">A privada da internet</span></a></td><td><a href="javascript:void(0)" data-forumid="57" class="threadItemArrow"></a></td></tr></table></div>'), 
        $("#maincontainer").find("#forum_list_container").find("td").each(function() {
            $(this).click(function() {
                $(this).unbind("click"), load_data($(this).find("a").attr("data-forumid"), "f", $(this).find("a").justtext());
            });
        }), show_debug_info("Appended forum list", new Date().getTime() - start_time3), 
        $(window).scrollTop(0), $("html").show();
    }
    //////////////////////
    start_time = new Date().getTime(), $("html").hide(), jQuery.fn.justtext = function() {
        return $.trim($(this).clone().children().remove().end().text());
    }, forum_url_clear = (url => $.trim(url.match(/([0-9]+)/i)[0])), document.addEventListener("DOMContentLoaded", function DOM_LOADED() {
        var hash;
        (document.removeEventListener("DOMContentLoaded", DOM_LOADED, !1), show_debug_info("Loaded DOM", end_time = new Date().getTime() - start_time), 
        $("#maincontainer").html().length < 2 && !window.location.hash && (currentjob = "show_forums"), 
        window.location.hash) && (~(hash = window.location.hash.substring(1)).indexOf("_f_") && (currentjob = "load_data", 
        currentjob_detail_1 = "f", currentjob_detail_2 = hash));
        window.location.hash && (~(hash = window.location.hash.substring(1)).indexOf("_t_") && (currentjob = "load_data", 
        currentjob_detail_1 = "t", currentjob_detail_2 = hash));
        switch (currentjob) {
          case "show_forums":
            show_forums();
            break;

          case "load_data":
            load_data(currentjob_detail_2.replace("_" + currentjob_detail_1 + "_", ""), currentjob_detail_1, "");
            break;

          default:
            $("html").show();
        }
    }, !1);
}();