SRC=yMenuExtender@yafp.de
DESTFOLDER=yMenuExtender@yafp.de
DESTPATH=~/.local/share/gnome-shell/extensions/

install:
	@mkdir -vp $(DESTPATH)/$(DESTFOLDER)
	@install -v -m 0644 $(SRC)/* $(DESTPATH)/$(DESTFOLDER)

uninstall:
	rm -rf $(DESTPATH)/$(DESTFOLDER)

