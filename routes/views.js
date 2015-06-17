/*
 * RENDER views.
 */

exports.faviconerror = function (req,res) {
    res.json("I dont know what to do");
};

exports.home = function(req, res) {
    res.render('home');
};

exports.settings = function(req, res) {
    res.render('settings');
};
