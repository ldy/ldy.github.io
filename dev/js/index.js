$(document).ready(function(){
    var nav = $('.g-nav');

    /**
     * Responsive Navigation
     */
    $('#menu-toggle').on('click', function(e) {
        var duration = 200;
        nav.slideToggle(duration);
        $(document).on('click', function() {
            nav.slideUp(duration);
        });
        e.stopPropagation();
    });

    nav.on('click', function(e) {
        e.stopPropagation();
    });

    /*
    *  Header Bar
    */
    if($(window).width() > 695) {
        var header = $('.g-header');
        var headerHeight = header.outerHeight();
        var logo = $('.g-logo');
        var navText = nav.find('a');
        var themeStyle = $('.g-banner').attr('data-theme');
        var scFlag = $(document).scrollTop();

        $(document).scroll(function() {
            var scrollTop = $(this).scrollTop();
            var navClassName = 'nav-' + themeStyle;

            if (scrollTop > headerHeight) {
                if(scrollTop > 3 * headerHeight) {
                    header.addClass('headerUp');
                }
                header.css({
                    'background-color': 'rgba(255, 255, 255, .98)',
                    'box-shadow': '0 1px 12px rgba(0, 0, 0, .08)'
                });
                logo.css({
                    'background': 'url(/assets/icons/logo_' + themeStyle + '.svg) no-repeat center',
                    'background-size': '100% 100%'
                });
                navText.css('color', '#666');
                nav.addClass(navClassName);
            } else {
                header.removeClass('headerUp');
                header.css({
                    'background-color': 'transparent',
                    'box-shadow': 'none'
                });
                logo.css({
                    'background': 'url(/assets/icons/logo.svg) no-repeat center',
                    'background-size': '100% 100%'
                });
                navText.css('color', '#fff');
                nav.removeClass(navClassName);
            }

            // scroll action
            if (scFlag > scrollTop) {
                header.addClass('headerDown');
            } else {
                header.removeClass('headerDown');
            }
            scFlag = scrollTop;
        });
    }

    /*
    * Post Cover Resize
    */
    function postCover(img, container) {
        var imgWidth = img.width();
        var containerWidth = container.width();
        var imgHeight = img.height();
        var containerHeight = container.height();

        if (imgHeight < containerHeight) {
            img.css({
                'width': 'auto',
                'height': '100%'
            });
            imgWidth = img.width(),
            containerWidth = container.width();
            var marginLeft = (imgWidth - containerWidth) / 2;
            img.css('margin-left', '-' + marginLeft + 'px');
        } else {
            var marginTop = (containerHeight - imgHeight) / 2;
            img.css('margin-top', marginTop + 'px');
        }

        img.fadeIn();
    }

    /**
     * The Post Navigator
     */
    $('.read-next-item section').each(function() {
        var n = $(this).height();
        var rn = $('.read-next-item').height();
        $(this).css('margin-top', (rn - n) / 2 + 'px');
        $(this).fadeIn();
    });

    $('.read-next-item img').each(function(){
        postCover($(this), $('.read-next-item'));
    });

    /**
     * Pagination
     */
    function pagination() {
        var total = parseInt($('#total_pages').val());
        var current = parseInt($('#current_pages').val());
        var baseUrl = $('#base_url').val();
        var limit = 3;

        var link_html = '';

        for (var i = current - limit; i < current; i++) {
            if (i > 0 && i !== 1) {
                link_html += '<a href="' + baseUrl + 'page' + i + '" class="page-link page-num">' + i + '</a>';
            } else if (i === 1) {
                link_html += '<a href="' + baseUrl + '" class="page-link page-num">' + i + '</a>';
            }
        }

        link_html += '<span class="page-link page-num active">' + current + '</span>';

        for (var j = current + 1; j <= current + limit; j++) {
            if (j <= total) {
                link_html += '<a href="' + baseUrl + 'page' + j + '" class="page-link page-num">' + j + '</a>';
            }
        }

        $('#page-link-container').html(link_html);
    }
    pagination();

    /**
     * Search
     */
    function Search() {
        var self = this;
        var input = $('#search_input');
        var result = $('.search_result');

        input.focus(function() {
            $('.icon-search').css('color', '#3199DB');
            result.show();
        });

        input.keyup(debounce(this.autoComplete));

        $(document).click(function(e) {
            if(e.target.id === 'search_input' || e.target.className === 'search_result' || e.target.className === 'search_item') {
                return;
            }
            $('.icon-search').css('color', '#CAD3DC');
            result.hide();
        });
    }

    Search.prototype.autoComplete = function() {
        var keywords = this.value.toLowerCase();

        if (keywords.length) {
            $('.icon-search').css('color', '#3199DB');
        } else {
            $('.icon-search').css('color', '#CAD3DC');
        }

        $.getJSON('../../search.json').done(function(data) {
            var html = '';
            for (var i in data) {
                var item = data[i];
                var title = item.title;
                var tags = item.tags;
                var url = item.url;

                var k = title + tags;
                if (keywords !== '' && k.toLowerCase().indexOf(keywords) >= 0) {
                    html += '<a class="search_item" href="' + item.url + '">' + item.title + '</a>';
                }
            }
            $('.search_result').html(html);
        });
    };

    function debounce(fn, delay) {
        var timer;
        delay = delay || 120;

        return function () {
            var ctx = this;
            var args = arguments;
            var later = function() {
                fn.apply(ctx, args);
            };
            clearTimeout(timer);
            timer = setTimeout(later, delay);
        };
    }

    new Search();

    /**
     * Night mode
     */
    function nightMode() {
        var el = $('body');
        var className = 'night-mode';

        var date = new Date();
        var hour = date.getHours();

        if (hour <= 6 || hour >= 18) {
            el.addClass(className);
        }
    }

    if ($('#nm-switch').val() === 'true') {
        nightMode();
    }

    /**
     * Copy and copyright
     */
    function setClipboardData(str) {
        str += '\n\n著作权归作者所有。\n商业转载请联系作者获得授权,非商业转载请注明出处。\n原文: ' + location.href;
        $('.post-content').on('copy', function(e) {
            var data = window.clipboardData || e.originalEvent.clipboardData;
            data.setData('text/plain', str);
            e.preventDefault();
        });
    }
    $('.post-content').on('mouseup', function(e) {
        var txt = window.getSelection();
        if (txt.toString().length >= 30) {
            setClipboardData(txt);
        }
    });

    /** Toc导航目录，切换图标 */
    function clickTOC() {
        $('.table-of-contents').toggleClass("active");
        $('#tools .tool.toc .b1').toggleClass("active");
        $('#tools .tool.toc .b2').toggleClass("active");
    }

    $('#tools .tool.toc').bind('click', function () {
        clickTOC()
    });

    $(".table-of-contents").on('click', function () {
        clickTOC()
    });

    /**
     * TOC highlight with the corresponding content
     */
    function locateCatelogList() {
        /*获取文章目录集合,可通过：header过滤器*/
        var alis = $('article :header');
        /*获取侧边栏目录列表集合*/
        var sidebar_alis = $('.table-of-contents a').parent();
        /*获取滚动条到顶部的距离*/
        var scroll_height = $(window).scrollTop();
        for (var i = 0; i < alis.length; i++) {
            /*获取锚点集合中的元素分别到顶点的距离*/
            var a_height = $(alis[i]).offset().top - 100;
            if (a_height < scroll_height) {
                /*高亮显示*/
                $(sidebar_alis).removeClass('active');
                $(sidebar_alis[i]).addClass('active');
                a_height = $(".toc-body li.active").offset().top - $(".toc-header h2").offset().top
                var t_height = $(".toc-body li.active").offset().top-$(".toc-body li:first-child").offset().top
                if (a_height < 22) {
                    $(".toc-body").scrollTop(t_height-350);
                }
                if (a_height > 350) {
                    $(".toc-body").scrollTop(t_height-72);
                }
            }
        }
    }

    // 滚动条滚动，修改样式
    if($(".toc-body").length >0){
        $($('.table-of-contents a').parent()[0]).addClass('active');
        locateCatelogList();
        $(window).bind('scroll', locateCatelogList);
    }

});
