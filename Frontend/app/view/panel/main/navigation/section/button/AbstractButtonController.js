/**
 * Контроллер абстрактной кнопки.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.view.panel.main.navigation.section.button.AbstractButtonController',
    {
        extend: 'Ext.app.ViewController',

        alias: 'controller.panel.navigation.section.button',

        onClick: function (button, e)
        {
            var me = this,
                view = me.getView(),
                cmdClass = view.cmdClass,
                manager = view.getEditorManager(),
                history,
                cmd;

            if (e)
            {
                e.stopPropagation();
            }

            cmd = Ext.create(cmdClass);

            if (cmd.execute())
            {
                history = manager.getHistory();
                history.add(cmd);
            }
        },

        /**
         * Синхронизирует кнопку с текстом.
         */
        onSync: function ()
        {
            var me = this,
                view = me.getView();

            if (view.isActiveSelection())
            {
                view.setDisabled(false);
            }
            else
            {
                view.setDisabled(true);
            }
        }
    }
);