/**
 * Правая основная панель.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.dockedPanel.RightPanel',
    {
        extend: 'FBEditor.view.dockedPanel.AbstractPanel',
        width: '15%',
        height: '80%',
        x: '85%',
        y: '20%',
        title: 'Правая панель',
        html: 'Содержимое правой панели'
    }
);