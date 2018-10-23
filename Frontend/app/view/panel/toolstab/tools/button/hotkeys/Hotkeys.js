/**
 * Кнопка редактора горячих клавиш.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.toolstab.tools.button.hotkeys.Hotkeys',
    {
        extend: 'Ext.Button',
        requires: [
            'FBEditor.view.window.hotkeys.Hotkeys'
        ],

        id: 'panel-toolstab-tools-button-hotkeys',
        xtype: 'panel-toolstab-tools-button-hotkeys',

        tooltipType: 'title',
        //html: '<i class="fa fa-keyboard-o"></i>',
	    iconCls: 'litres-icon-keyboard',

        /**
         * @private
         * @property {FBEditor.view.window.hotkeys.Hotkeys} Окно редактора горячих клавиш.
         */
        win: null,

        translateText: {
            tooltip: 'Редактор горячих клавиш'
        },

        initComponent: function ()
        {
            var me = this,
                tt = me.translateText;

            me.tooltip = tt.tooltip;

            me.callParent(arguments);
        },

        handler: function ()
        {
            var me = this,
                win;

            win = me.getWindow();
            win.show();
        },

        /**
         * Возвращает окно редактора горячих клавиш.
         * @return {FBEditor.view.window.hotkeys.Hotkeys}
         */
        getWindow: function ()
        {
            var me = this,
                win;

            win = me.win || Ext.create('FBEditor.view.window.hotkeys.Hotkeys');
            me.win = win;

            return win;
        }
    }
);