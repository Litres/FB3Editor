/**
 * Все связанные с данным документом персоны и объекты.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.Relations',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.relations.subject.Subject',
			'FBEditor.view.form.desc.relations.object.Object'
		],
		xtype: 'form-desc-relations',

		translateText: {
			object: 'Объекты'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'form-desc-relations-subject',
					layout: 'anchor',
					defaults: {
						anchor: '100%'
					}
				},
				{
					xtype: 'fieldset',
					title: FBEditor.view.form.desc.Desc.TITLE_TPL.replace('{%s}', me.translateText.object),
					collapsible: true,
					collapsed: true,
					margin: '0',
					padding: '2',
					anchor: '100%',
					items: [
						{
							xtype: 'form-desc-relations-object',
							layout: 'anchor',
							defaults: {
								anchor: '100%'
							}
						}
					]
				}
			];
			me.callParent(arguments);
		}
	}
);