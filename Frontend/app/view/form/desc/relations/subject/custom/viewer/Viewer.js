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
			'FBEditor.view.form.desc.relations.subject.custom.viewer.ViewerController',
			'FBEditor.view.form.desc.relations.subject.custom.viewer.link.Link',
			'FBEditor.view.form.desc.relations.subject.custom.viewer.switcher.Switcher',
			'FBEditor.view.form.desc.relations.subject.custom.viewer.title.Title'
		],

		xtype: 'form-desc-relations-subject-custom-viewer',
		controller: 'form.desc.relations.subject.custom.viewer',
		
		listeners: {
			setTitle: 'onSetTitle',
			setLink: 'onSetLink',
			click: {
				element: 'el',
				fn: 'onClick'
			}
		},

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

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.relations.subject.custom.viewer.title.Title} Компонент стандартное
		 * написание.
		 */
		_title: null,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.relations.subject.custom.viewer.link.Link} Компонент тип связи.
		 */
		_link: null,

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
		
		style: {
		  'cursor': 'pointer'
		},

		afterRender: function ()
		{
			var me = this,
				descManager = FBEditor.desc.Manager;
			
			//me.setStyle('cursor','pointer');

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
		},

		/**
		 * Возвращает компонент стандартное написание.
		 * @return {FBEditor.view.form.desc.relations.subject.custom.viewer.title.Title}
		 */
		getTitle: function ()
		{
			var me = this,
				title = me._title;

			title = title || me.down('form-desc-relations-subject-custom-viewer-title');
			me._title = title;

			return title;
		},

		/**
		 * Возвращает компонент тип связи.
		 * @return {FBEditor.view.form.desc.relations.subject.custom.viewer.link.Link}
		 */
		getLink: function ()
		{
			var me = this,
				link = me._link;

			link = link || me.down('form-desc-relations-subject-custom-viewer-link');
			me._link = link;

			return link;
		},
		
		/**
		 * Возвращает родительский контейнер данных.
		 * @return {FBEditor.view.form.desc.relations.subject.CustomContainer}
		 */
		getCustomContainer: function ()
		{
			var me = this,
				container = me._container;
			
			container = container || me.up('form-desc-relations-subject-container-custom');
			me._container = container;
			
			return container;
		}
	}
);