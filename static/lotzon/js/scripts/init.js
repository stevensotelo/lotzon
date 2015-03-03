$(this).ready(function(){
    MAPS.tools.init('map-canvas');
    if(MAPS.vars.grandient==[])
        MAPS.tools.generateGradient(100);
    $(".content-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
});