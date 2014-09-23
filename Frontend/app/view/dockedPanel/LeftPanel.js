/**
 * Левая основная панель.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.dockedPanel.LeftPanel',
    {
        extend: 'FBEditor.view.dockedPanel.AbstractPanel',
        width: '15%',
        height: '100%',
        x: 0,
        y: 0,
        title: 'Левая панель',
        html: 'Содержимое левой панели'
    }
);