/**
 * Панель редактирования элемента clipped.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.props.body.editor.clipped.Editor',
    {
        extend: 'FBEditor.view.panel.main.props.body.editor.AbstractEditor',

        afterRender: function ()
        {
            var me = this,
                panelProps = me.getPanelProps(),
                convertBtn = panelProps.getConvertBtn();

            convertBtn.setVisible(false);

            me.callParent(arguments);
        }
    }
);