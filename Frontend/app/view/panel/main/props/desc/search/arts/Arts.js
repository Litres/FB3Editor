/**
 * Родительский контейнер с результатами поиска произведений.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.desc.search.arts.Arts',
	{
		extend: 'FBEditor.view.panel.main.props.desc.search.Container',
		requires: [
			'FBEditor.view.panel.main.props.desc.search.arts.ArtsController',
			'FBEditor.view.container.desc.search.arts.Arts'
		],
		controller: 'props.desc.search.arts',
		xtype: 'props-desc-search-arts',
		id: 'props-desc-search-arts',

		xtypeContainerItems: 'container-desc-search-arts',

		afterRender: function ()
		{
			var me = this,
				bridge = FBEditor.getBridgeWindow(),
				refCmp;

			refCmp = bridge.Ext.getCmp('form-desc-title');

			// устанавливаем связанный компонент
			me.setReferenceCmp(refCmp);

			me.callParent(arguments);
		}
	}
);