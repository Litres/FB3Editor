/**
 * Тип связи персоны.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.Link',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.relations.subject.LinkController',
			'FBEditor.view.form.desc.relations.subject.radio.Radio',
			'FBEditor.view.form.desc.relations.subject.LinkList'
		],

		xtype: 'form-desc-relations-subject-link',
		controller: 'form.desc.relations.subject.link',
		cls: 'form-desc-relations-subject-link',

		listeners: {
			resetFields: 'onResetFields',
			loadData: 'onLoadData',
			changeList: 'onChangeList'
		},

		layout: 'hbox',

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.relations.subject.radio.Radio} Группа радиобатонов.
		 */
		radio: null,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.relations.subject.LinkList} Список типов.
		 */
		list: null,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.relations.subject.CustomContainer} Родительский контейнер данных.
		 */
		_container: null,

		translateText: {
			label: 'Тип связи'
		},

		initComponent: function ()
		{
			var me = this;

			me.fieldLabel = me.translateText.label;
			me.items = [
				{
					xtype: 'relations-subject-link-radio'
				},
				{
					xtype: 'form-desc-relations-subject-link-list',
					flex: 1,
					margin: '0 0 0 10'
				}
			];
			me.callParent(arguments);
		},

		getValue: function ()
		{
			var me = this,
				radio = me.getRadio(),
				checked,
				list,
				data;

			checked = radio.getChecked();

			//console.log('radio', radio, checked);

			data = checked[0] ? checked[0].getGroupValue() : null;

			list = me.down('form-desc-relations-subject-link-list');
			data = data === 'other-list' ? list.getValue() : data;

			return data;
		},

		/**
		 * Возвращает список типов.
		 * @return {FBEditor.view.form.desc.relations.subject.LinkList}
		 */
		getList: function ()
		{
			var me = this,
				list;

			list = me.list || me.down('form-desc-relations-subject-link-list');
			me.list = list;

			return list;
		},

		/**
		 * Возвращает группу радиобатонов.
		 * @return {FBEditor.view.form.desc.relations.subject.radio.Radio}
		 */
		getRadio: function ()
		{
			var me = this,
				radio;

			radio = me.radio || me.down('relations-subject-link-radio');
			me.radio = radio;

			return radio;
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