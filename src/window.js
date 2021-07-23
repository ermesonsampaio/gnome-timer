/* window.js
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

const { GObject, Gtk, GLib, Gio } = imports.gi;

var TimerWindow = GObject.registerClass({
    GTypeName: 'TimerWindow',
    Template: 'resource:///org/ermeso/Timer/window.ui',
    InternalChildren: [
      'inputs_stack',
      'hours_adjustment',
      'minutes_adjustment',
      'seconds_adjustment',
      'timer_label',
      'buttons_stack',
      'start_button',
      'pause_button',
      'refresh_button',
      'resume_button',
      'delete_button',
    ],
}, class TimerWindow extends Gtk.ApplicationWindow {
    _init(application) {
        this._application = application;

        super._init({ application });

        this._start_button.connect('clicked', this._onClickStartButton.bind(this));
        this._pause_button.connect('clicked', this._onClickPauseButton.bind(this));
        this._resume_button.connect('clicked', this._onClickResumeButton.bind(this));
        this._refresh_button.connect('clicked', this._onClickRefreshButton.bind(this));
        this._delete_button.connect('clicked', this._onClickDeleteButton.bind(this));
    }

    _onClickStartButton() {
      this._stopTimer = false;
      this._pauseTimer = false;

      this._buttons_stack.visible_child_name = 'pause';

      this._seconds = this._hours_adjustment.value * 60 * 60 +
        this._minutes_adjustment.value * 60 +
        this._seconds_adjustment.value;

      this._backupSeconds = this._seconds;

      this._setTime();

      this._inputs_stack.visible_child_name = 'label';
      this._timer_label.label = `${this._formatTime()}`;

      this._timer();
    }

    _timer() {
      return GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
        if (this._pauseTimer) return GLib.SOURCE_CONTINUE;

        if (this._stopTimer) {
          this._stopTimer = false;
          return GLib.SOURCE_REMOVE;
        };

        this._seconds--;
        this._setTime();
        this._timer_label.label = `${this._formatTime()}`;

        if (this._seconds <= 0) {
          this._notify();
          this._stopTimerFunction();
        }

        return this._seconds > 0 ? GLib.SOURCE_CONTINUE : GLib.SOURCE_REMOVE;
      });
    }

    _onClickPauseButton() {
      this._pauseTimer = true;
      this._buttons_stack.visible_child_name = 'resume';
    }

    _onClickResumeButton() {
      this._pauseTimer = false;
      this._buttons_stack.visible_child_name = 'pause';
    }

    _onClickDeleteButton() {
      this._stopTimer = true;
      this._buttons_stack.visible_child_name = 'start';
      this._inputs_stack.visible_child_name = 'inputs';
    }

    _onClickRefreshButton() {
      this._seconds = this._backupSeconds;
      this._stopTimer = true;

      this._setTime();
      this._timer_label.label = `${this._formatTime()}`;
      this._timer();
    }

    _setTime() {
      this._hours_value = Math.floor(this._seconds / 60 / 60);
      this._minutes_value = (Math.floor(this._seconds / 60)) % 60;
      this._seconds_value = this._seconds % 60;
    }

    _formatTime() {
      return `${this._hours_value} : ${this._minutes_value} : ${this._seconds_value}`;
    }

    _stopTimerFunction() {
      this._buttons_stack.visible_child_name = 'start';
      this._inputs_stack.visible_child_name = 'inputs';
    }

    _notify() {
      const notification = new Gio.Notification();

      notification.set_title('Time is up!');
      notification.set_body('Timer countdown finished');
      notification.set_icon(new Gio.ThemedIcon({ name: 'alarm-symbolic' }));


      this._application.send_notification('org.ermeso.Timer', notification);
    }
});

