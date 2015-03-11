/**
 * Панель имени файла.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.filename.FileName',
	{
		extend: 'Ext.container.Container',
		requires: [
			'FBEditor.view.panel.filename.FileNameController',
			'FBEditor.view.panel.filename.display.Display',
			'FBEditor.view.panel.filename.field.Field'
		],
		id: 'panel-filename',
		xtype: 'panel-filename',
		controller: 'panel.filename',
		floating: true,
		autoShow: true,
		shadow: false,
		border: false,
		monitorResize: true,
		plain: true,
		defaultAlign: 't-c',
		y: 3,
		layout: 'card',
		width: '50%',
		listeners: {
			click: {
				element: 'el',
				fn: 'onClick'
			},
			setName: 'onSetName',
			afterrender: 'onAfterRender'
		},
		items: [
			{
				xtype: 'panel-filename-display'
			},
			{
				xtype: 'panel-filename-field'
			}
		]
	}
);