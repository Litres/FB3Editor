/**
 * Абстрактный класс основной панели.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.dockedPanel.AbstractPanel',
    {
        extend: 'Ext.window.Window',
        autoScroll: true,
        bodyPadding: 10,
        constrain: true,
        closable: false,
        monitorResize: true,
        shadow: false
    }
);