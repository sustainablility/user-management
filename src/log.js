let fs = require('fs');
let sillyData = require('silly-datetime');

/**
 * For looging.
 * This module would record the log data in to file.
 * There are four types of log: access, normal, error, fatal.
 */

exports.access = (title,detail,host,user) => {
    fs.open(__dirname + '/../log/access/' + sillyData.format(new Date(), 'YYYY-MM-DD') + '.log',"a+",(err,fd) => {
        if (err) {
            console.log(err);
        }
        fs.writeFile(fd, "------------------------------------" + "\n" + 'Host: ' + host + "\n" + 'User: ' + user + "\n - " + title + ' - \n' + detail + "\n" + "------------------------------------" + "\n",(err) => {
            if (err) {
                console.log(err);
            }
        });
    });
};

exports.normal = (title,detail) => {
    fs.open(__dirname + "/../log/normal/" + sillyData.format(new Date(), 'YYYY-MM-DD') + ".log","a+",(err,fd) => {
        if (err) {
            console.log(err);
        }
        fs.writeFile(fd, "------------------------------------" + "\n" + sillyData.format(new Date(), 'YYYY-MM-DD HH:mm:ss') + "\n" + title + "\n" + detail + "\n" + "------------------------------------" + "\n",(err) => {
            if (err) {
                console.log(err);
            }
        });
    });
};

exports.error = (title,detail) => {
    fs.open(__dirname + "/../log/error/" + sillyData.format(new Date(), 'YYYY-MM-DD') + ".log","a+",(err,fd) => {
        if (err) {
            console.log(err);
        }
        fs.writeFile(fd, "------------------------------------" + "\n" + sillyData.format(new Date(), 'YYYY-MM-DD HH:mm:ss') + "\n" + title + "\n" + detail + "\n" + "------------------------------------" + "\n",(err) => {
            if (err) {
                console.log(err);
            }
        });
    });
};

exports.fatal = (title,detail) => {
    fs.open(__dirname + "/../log/fatal/" + sillyData.format(new Date(), 'YYYY-MM-DD') + ".log","a+",(err,fd) => {
        if (err) {
            console.log(err);
        }
        fs.writeFile(fd, "------------------------------------" + "\n" + sillyData.format(new Date(), 'YYYY-MM-DD HH:mm:ss') + "\n" + title + "\n" + detail + "\n" + "------------------------------------" + "\n",(err) => {
            if (err) {
                console.log(err);
            }
        });
    });
};
