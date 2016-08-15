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
		 * @property {FBEditor.view.form.desc.relations.subject.item.SubjectItem} Родительский контейнер каждой персоны.
		 */
		_subjectItem: null,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.relations.subject.custom.viewer.switcher.Switcher} Переключатель.
		 */
		_switcher: null,

		initComponent: function ()
		{
			var me = this;

			me.hidden = true;

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

			if (descManager.isLoadedData())
			{
				// если данные загружены, то показываем краткую сводку
				me.setVisible(true);
			}

			me.callParent(arguments);
		},

		/**
		 * Возвращает родительский контейнер каждой персоны.
		 * @return {FBEditor.view.form.desc.relations.subject.item.SubjectItem}
		 */
		getSubjectItem: function ()
		{
			var me = this,
				subjectItem = me._subjectItem;

			subjectItem = subjectItem || me.up('form-desc-relations-subject-item');
			me._subjectItem = subjectItem;

			return subjectItem;
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