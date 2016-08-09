/**
 * Контейнер содержащий компоненты ручного ввода.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.custom.editor.Editor',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.relations.subject.custom.editor.EditorController',
			'FBEditor.view.form.desc.relations.subject.name.Name',
			'FBEditor.view.form.desc.relations.subject.name.main.Main',
			'FBEditor.view.form.desc.relations.subject.title.Title',
			'FBEditor.view.form.desc.relations.subject.Link'
		],

		xtype: 'form-desc-relations-subject-custom-editor',
		controller: 'form.desc.relations.subject.custom.editor',

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.relations.subject.CustomContainer} Родительский контейнер данных.
		 */
		_container: null,

		translateText: {
			id: 'ID',
			idError: 'По шаблону [0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}. ' +
			         'Например: 0dad1004-1430-102c-96f3-af3a14b75ca4',
			firstName: 'Имя',
			middleName: 'Отчество (второе имя)',
			lastName: 'Фамилия',
			titleMain: 'Стандартное написание',
			titleAlt: 'Альтернативное написание',
			percent: 'Процент владения',
			pageEditor: 'Страница редактирования'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'desc-fieldcontainer',
					layout: 'hbox',
					cls: 'block-container', // необходим для выделения блока полей
					items: [
						{
							xtype: 'desc-fieldcontainer',
							flex: 1,
							layout: 'anchor',
							defaults: {
								anchor: '100%',
								labelWidth: 160,
								labelAlign: 'right',
								xtype: 'textfield',
								keyEnterAsTab: true
							},
							items: [
								{
									xtype: 'form-desc-field-link-uuid',
									fieldLabel: me.translateText.id,
									name: 'relations-subject-id'
								},
								{
									xtype: 'form-desc-relations-subject-name-main',
									fieldLabel: me.translateText.lastName,
									name: 'relations-subject-last-name'
								},
								{
									xtype: 'form-desc-relations-subject-name',
									fieldLabel: me.translateText.firstName,
									name: 'relations-subject-first-name',
									cls: 'field-optional'
								},
								{
									xtype: 'form-desc-relations-subject-name',
									fieldLabel: me.translateText.middleName,
									name: 'relations-subject-middle-name',
									cls: 'field-optional'
								},
								{
									xtype: 'numberfield',
									fieldLabel: me.translateText.percent,
									name: 'relations-subject-percent',
									hideTrigger: true,
									minValue: 0,
									maxValue: 100,
									autoStripChars: true,
									cls: 'field-optional'
								}
							]
						},
						{
							xtype: 'fieldcontainer',
							width: 10
						},
						{
							xtype: 'desc-fieldcontainer',
							flex: 1,
							layout: 'anchor',
							items: [
								{
									xtype: 'form-desc-relations-subject-title',
									name: 'relations-subject-title',
									translateText: {
										main: me.translateText.titleMain,
										alt: me.translateText.titleAlt
									}
								}
							]
						}
					]
				},
				{
					xtype: 'form-desc-relations-subject-link',
					labelWidth: 160,
					labelAlign: 'right'
				}
			];

			me.callParent(arguments);
		},

		afterRender: function ()
		{
			var me = this;

			me.callParent(arguments);
		},

		/**
		 * Возвращает родительский контейнер.
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