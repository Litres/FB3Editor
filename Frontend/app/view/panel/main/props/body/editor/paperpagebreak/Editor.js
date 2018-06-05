/**
 * Панель редактирования элемента paper-page-break.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.props.body.editor.paperpagebreak.Editor',
    {
        extend: 'FBEditor.view.panel.main.props.body.editor.AbstractEditor',

        translateText: {
            pageBefore: 'page-before',
            pageAfter: 'page-after'
        },

        initComponent: function ()
        {
            var me = this;

            me.items = [
                {
                    xtype: 'numberfield',
                    name: 'page-before',
                    labelAlign: 'left',
                    allowBlank: false,
                    fieldLabel: me.translateText.pageBefore,
                    minValue: 0
                },
                {
                    xtype: 'numberfield',
                    name: 'page-after',
                    labelAlign: 'left',
                    fieldLabel: me.translateText.pageAfter,
                    minValue: 0
                }
            ];

            me.callParent(arguments);
        }
    }
);