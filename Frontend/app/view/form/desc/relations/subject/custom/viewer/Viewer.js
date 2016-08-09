/**
 * Контейнер отображающий краткую сводку данных.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.custom.viewer.Viewer',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.relations.subject.custom.viewer.link.Link',
			'FBEditor.view.form.desc.relations.subject.custom.viewer.switcher.Switcher',
			'FBEditor.view.form.desc.relations.subject.custom.viewer.title.Title'
		],

		xtype: 'form-desc-relations-subject-custom-viewer',

		layout: 'hbox',

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.relations.subject.custom.viewer.switcher.Switcher} Переключатель.
		 */
		_switcher: null,

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'form-desc-relations-subject-custom-viewer-switcher'
				},
				{
					xtype: 'form-desc-relations-subject-custom-viewer-link'
				},
				{
					xtype: 'form-desc-relations-subject-custom-viewer-title'
				}
			];

			me.callParent(arguments);
		},

		afterRender: function ()
		{
			var me = this,
				descManager = FBEditor.desc.Manager;

			// показываем или скрываем поля редактирования
			me.setVisible(descManager.loadingProcess);

			me.callParent(arguments);
		},

		/**
		 * Возвращает переключатель.
		 * @return {FBEditor.view.form.desc.relations.subject.custom.viewer.switcher.Switcher}
		 */
		getSwitcher: function ()
		{
			var me = this,
				switcher = me._switcher;

			switcher = switcher || me.down('form-desc-relations-subject-custom-viewer-switcher');
			me._switcher = switcher;

			return switcher;
		}
	}
);