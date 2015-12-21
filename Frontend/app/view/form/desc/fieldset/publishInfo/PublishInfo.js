/**
 * Информация о бумажной публикации.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.fieldset.publishInfo.PublishInfo',
	{
		extend: 'FBEditor.view.form.desc.fieldset.AbstractFieldset',
		requires: [
			'FBEditor.view.form.desc.fieldset.publishInfo.PublishInfoController',
			'FBEditor.view.form.desc.publishInfo.PublishInfo'
		],
		xtype: 'desc-fieldset-publishInfo',
		id: 'desc-fieldset-publishInfo',
		controller: 'desc.fieldset.publishInfo',
		title: 'Информация о бумажной публикации',
		xtypeChild: 'publishInfo',

		listeners: {
			expand: 'onExpand'
		}
	}
);