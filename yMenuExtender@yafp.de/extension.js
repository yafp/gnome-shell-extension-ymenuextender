// Icons: /usr/share/icons


const St = imports.gi.St;
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const PanelMenu = imports.ui.panelMenu;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;
const Util = imports.misc.util;                 // to run external commands

const Gettext = imports.gettext.domain("gnome-shell-extension-ymenuextender");
const _ = Gettext.gettext;


const ScrollableMenu = new Lang.Class({
  Name: 'ScrollableMenu.ScrollableMenu',
  Extends: PopupMenu.PopupMenuSection,

  _init: function() {
    this.parent();
    let scrollView = new St.ScrollView({
      x_fill: true,
      y_fill: false,
      y_align: St.Align.START,
      overlay_scrollbars: true,
      style_class: 'vfade'
    });
    this.innerMenu = new PopupMenu.PopupMenuSection();
    scrollView.add_actor(this.innerMenu.actor);
    this.actor.add_actor(scrollView);
  },

  addMenuItem: function(item) {
    this.innerMenu.addMenuItem(item);
  },

  removeAll: function() {
    this.innerMenu.removeAll();
  }
});


const yMenuExtenderItem = new Lang.Class({
    Name: 'yMenuExtenderItem.yMenuExtenderItem',
    Extends: PopupMenu.PopupBaseMenuItem,

    _init: function(text, icon_name, gicon, callback) {
        this.parent(0.0, text);

        let icon_cfg = { style_class: 'popup-menu-icon' };
        if (icon_name != null) {
          icon_cfg.icon_name = icon_name;
        } else if (gicon != null) {
          icon_cfg.gicon = gicon;
        }

        this.icon = new St.Icon(icon_cfg);
        this.actor.add_child(this.icon);
        this.label = new St.Label({ text: text });
        this.actor.add_child(this.label);

        this.connect('activate', callback);
    },

    destroy: function() {
        this.parent();
    }
});


const MainMenu = new Lang.Class({
    Name: 'MainMenu.MainMenu',
    Extends: PanelMenu.Button,

    _init: function() {
        this.parent(0.0, _("Menu"));
        this.extensionIcon = new St.Icon({ icon_name: 'open-menu-symbolic', style_class: 'popup-menu-icon' })
        this.actor.add_actor(this.extensionIcon);

        this._addConstMenuItems();
    },

    _addConstMenuItems: function() {
        // Menu: Lock
        this.lock_item = new yMenuExtenderItem(_("Lock"), "system-lock-screen-symbolic", null, Lang.bind(this, this._onLock));
        this.menu.addMenuItem(this.lock_item);
        
        // Menu: Logout
        this.logout_item = new yMenuExtenderItem(_("Logout"), "application-exit-symbolic", null, Lang.bind(this, this._onLogout));
        this.menu.addMenuItem(this.logout_item);
        
        // Menu: Hibernate
        this.hibernate_item = new yMenuExtenderItem(_("Hibernate"), "application-exit-symbolic", null, Lang.bind(this, this._onHibernate));
        this.menu.addMenuItem(this.hibernate_item);
        
        // Menu: Reboot
        this.reboot_item = new yMenuExtenderItem(_("Reboot"), "application-exit-symbolic", null, Lang.bind(this, this._onReboot));
        this.menu.addMenuItem(this.reboot_item);
        
        // Menu: Shutdown
        this.shutdown_item = new yMenuExtenderItem(_("Shutdown"), "system-shutdown-symbolic", null, Lang.bind(this, this._onShutdown));
        this.menu.addMenuItem(this.shutdown_item);
        
        // Separator
        this.separator = new PopupMenu.PopupSeparatorMenuItem();
        this.menu.addMenuItem(this.separator);
        
        // Menu: About-Notify
        this.about_item = new yMenuExtenderItem(_("About"), "help-about-symbolic", null, Lang.bind(this, this._onAbout));
        this.menu.addMenuItem(this.about_item);
    },

    destroy: function() {
        this.parent();
    },

    

    // Lock
    //
    _onLock: function() {
        Util.spawn(['gnome-screensaver-command', '--lock'])
    },
    
    // Logout
    //
    _onLogout: function() {
        Util.spawn(['gnome-session-quit', '--logout'])
    },
    
    // Hibernate
    //
    _onHibernate: function() {
        Util.spawn(['systemctl', 'suspend'])
    },
    
    // Reboot
    //
    _onReboot: function() {
        Util.spawn(['gnome-screensaver-command', '--reboot'])
    },
    
    // Shutdown
    //
    _onShutdown: function() {
        Util.spawn(['gnome-session-quit', '--power-off'])
    },
    
    // About
    //
    _onAbout: function() {
        Util.spawn(['notify-send', 'yMenuExtender', 'This is yMenuExtender'])
    }

});



function init(extensionMeta) {
    imports.gettext.bindtextdomain("gnome-shell-extension-ymenuextender", extensionMeta.path + "/locale");
}

let _indicator;


// Enable the extension
//
function enable() {
    _indicator = new MainMenu;
    Main.panel.addToStatusArea('yMenuExtenderMain_button', _indicator);
    
    // Hide Activities Button
    //
    let indicator = Main.panel.statusArea['activities'];
    if(indicator != null) {
        indicator.container.hide();
    }
}


// Disable the extension
//
function disable() {
    _indicator.destroy();
  
    // Show Activities Button
    let indicator = Main.panel.statusArea['activities'];
    if(indicator != null) {
        indicator.container.show();
    }
}

