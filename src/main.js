/* main.js
 *
 * Copyright 2021 Ermeso
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

pkg.initGettext();
pkg.initFormat();
pkg.require({
  'Gio': '2.0',
  'Gtk': '4.0',
});

const { Gio, Gtk } = imports.gi;

const { TimerWindow } = imports.window;

function main(argv) {
    const application = new Gtk.Application({
        application_id: 'org.ermeso.Timer',
        flags: Gio.ApplicationFlags.FLAGS_NONE,
    });

    application.connect('activate', app => {
        let activeWindow = app.activeWindow;

        if (!activeWindow) {
            activeWindow = new TimerWindow(app);
        }

        activeWindow.present();
    });

    return application.run(argv);
}
