window.onload = function (ev) {
    let pattern = /^(fnref)([\d]+)(:[\d]+)?$/;
    tippy('a[id^="fnref"]', {
        html: e1 => '#tooltip' + pattern.exec(e1.id)[2],
        arrow: true,
        animation: 'fade',
        distance: 15,
        arrowTransform: 'scale(2)',
        theme: ''
    })
};