/**
 * Верхняя основная панель.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.dockedPanel.TopPanel',
    {
        extend: 'FBEditor.view.dockedPanel.AbstractPanel',
        width: '85%',
        height: '20%',
        x: '15%',
        y: 0,
        title: 'Верхняя панель',
        html: 'Содержимое верхней панели'
    }
);