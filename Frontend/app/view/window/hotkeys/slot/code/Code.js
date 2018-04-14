/**
 * Код.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.window.hotkeys.slot.code.Code',
    {
        extend: 'FBEditor.view.window.hotkeys.slot.AbstractSlot',

        id: 'window-hotkeys-slot-code',
        xtype: 'window-hotkeys-slot-code',

        defaultKeys: {
            title: 'Код',
            key: 'C',
            ctrl: true,
            alt: true
        }
    }
);