/**
 * Контроллер панели.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.view.panel.main.navigation.section.PanelController',
    {
        extend: 'Ext.app.ViewController',

        alias: 'controller.panel.navigation.section',

        /**
         * Синхронизирует кнопки.
         */
        onSync: function ()
        {
            var me = this,
                view = me.getView(),
                buttons;

            buttons = view.getButtons();

            Ext.each(
                buttons,
                function (btn)
                {
                    btn.fireEvent('sync');
                }
            );
        },

        /**
         * Активирует панель.
         */
        onEnablePanel: function ()
        {
            var me = this,
                view = me.getView();

            view.setVisible(true);
            me.onSync();
        },

        /**
         * Активирует панель.
         */
        onDisablePanel: function ()
        {
            var me = this,
                view = me.getView();

            view.setVisible(false);
        }
    }
);