/**
 * Кнопка замены имени ресурса.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.resource.replacer.button.rename.Rename',
    {
        extend: 'FBEditor.resource.replacer.button.AbstractButton',
        requires: [
            'FBEditor.resource.replacer.button.rename.RenameController'
        ],

        xtype: 'resource-replacer-button-rename',
        controller: 'resource.replacer.button.rename',

        translateText: {
            text: 'Добавить новый ресурс как '
        },

        afterRender: function ()
        {
            var me = this,
                tt = me.translateText,
                win = me.getWindow(),
                name,
                resData;

            me.callParent(arguments);

            resData = win.getResourceData();
            name = resData.name;
            me.changeText(name);
        },

        /**
         * Меняет текст кнопки.
         * @param {String} name Имя текущего ресурса.
         */
        changeText: function (name)
        {
            var me = this,
                tt = me.translateText,
                win = me.getWindow(),
                manager,
                resourceName;

            manager = win.getResourceManager();

            // новое имя для ресурса
            resourceName = manager.getNewResourceName(name);

            me.setText(tt.text + resourceName);
        }
    }
);