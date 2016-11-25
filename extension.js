/*
Sources:
    - Lock Commands:    http://askubuntu.com/questions/184728/how-do-i-lock-the-screen-from-a-terminal
    - Check usage of:   endSessionDialog.js
*/


const Lang = imports.lang;
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const Util = imports.misc.util;             // to run external commands

//const EqualizerIcon = 'equalizer-symbolic';
const ExtensionIcon = 'yMenuExtender';

const QpaeqSubMenu = new Lang.Class({
    Name: 'QpaeqSubMenu',
    Extends: PopupMenu.PopupSubMenuMenuItem,

    // init the extension
    _init: function() {
        //log('Init');
        this.parent('yMenuExtender: loading...', true);

        this.icon.style_class = 'system-status-icon';
        this.icon.icon_name = ExtensionIcon;
        this.label.set_text("yMenuExtender");

        // Menu-Item: Lock
        this.item = new PopupMenu.PopupMenuItem('Lock');
        this.item.connect('activate', Lang.bind(this, this._launch));
        this.menu.addMenuItem(this.item);
        
        // Menu Item: Logout
        this.item = new PopupMenu.PopupMenuItem('Logout');
        this.item.connect('activate', Lang.bind(this, this._doLogout));
        this.menu.addMenuItem(this.item);
        
        // Menu Item: Reboot
        this.item = new PopupMenu.PopupMenuItem('Reboot');
        this.item.connect('activate', Lang.bind(this, this._doReboot));
        this.menu.addMenuItem(this.item);
        
        // Menu Item: Shutdown
        this.item = new PopupMenu.PopupMenuItem('Shutdown');
        this.item.connect('activate', Lang.bind(this, this._doShutdown));
        this.menu.addMenuItem(this.item);
        
        // Notification that init is done
        //
        Util.spawn(['notify-send', 'yMenuExtender', 'Finished initializing'])
    },

    _launch: function() {
        // Fedora
        //Util.spawn(['dbus-send', '--type=method_call', '--dest=org.gnome.ScreenSaver /org/gnome/ScreenSaver org.gnome.ScreenSaver.Lock'])
        
        // Ubuntu
        Util.spawn(['gnome-screensaver-command', '--lock'])
    },
    
    _doLogout: function() {
        Util.spawn(['gnome-session-quit', '--logout'])
    },
    
    _doReboot: function() {
        Util.spawn(['gnome-session-quit', '--reboot'])
    },
    
    _doShutdown: function() {
        Util.spawn(['gnome-session-quit', '--power-off'])
    },
    
    
    _displayNotification: function() {
        // should check if notify-send exists - and use it only if it is there
        //hash foo 2>/dev/null || { echo >&2 "I require foo but it's not installed.  Aborting."; exit 1; }
        //
    },
    
    destroy: function() {
        this.parent();
    }
});

let qpaeqSubMenu = null;



// add icons path to the theme search path
//
function init(extensionMeta) {
    let theme = imports.gi.Gtk.IconTheme.get_default();
    theme.append_search_path(extensionMeta.path + "/icons");
}



// Enable the extension (add below sound-volume slider)
// 
function enable() {
    if (qpaeqSubMenu != null)
        return;
    qpaeqSubMenu = new QpaeqSubMenu();

    // Try to add the output-switcher right below the output slider...
    let volMen = Main.panel.statusArea.aggregateMenu._volume._volumeMenu;
    let items = volMen._getMenuItems();
    let i = 0;
    while (i < items.length)
        if (items[i] === volMen._output.item)
            break;
        else
            i++;
    volMen.addMenuItem(qpaeqSubMenu, i+1);
    
    
    // Hide Activities Button
    //
    let indicator = Main.panel.statusArea['activities'];
    if(indicator != null) {
        indicator.container.hide();
    }
    
    
    Util.spawn(['notify-send', 'yMenuExtender', 'Enabled yMenuExtender extension'])
}



// Disable the extensionMeta
//
function disable() {
    qpaeqSubMenu.destroy();
    qpaeqSubMenu = null;
    Util.spawn(['notify-send', 'yMenuExtender', 'Disabled yMenuExtender extension'])
    
    // Show Activities Button
    let indicator = Main.panel.statusArea['activities'];
    if(indicator != null) {
        indicator.container.show();
    }
}

