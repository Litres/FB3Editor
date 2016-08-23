/**
 * Стандартное написание.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.title.Title',
	{
		extend: 'FBEditor.view.form.desc.title.Title',
		requires: [
			'FBEditor.view.form.desc.relations.subject.title.TitleController'
		],

		xtype: 'form-desc-relations-subject-title',
		controller: 'form.desc.relations.subject.title',

		listeners: {
			changeTitle: 'onChangeTitle'
		},

		layout: 'anchor',
		enableSub: false,

		defaults: {
			anchor: '100%',
			labelWidth: 160,
			labelAlign: 'right'
		},

		/**
		 * @property {Boolean} Заполнять ли стандартное описание автоматически из полей ФИО.
		 */
		autoFilled: true,

		/**
		 * @private
		 * @property {Ext.form.field.Text}
		 */
		titleMain: null,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.relations.subject.name.Name}
		 */
		lastName: null,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.relations.subject.name.Name}
		 */
		middleName: null,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.relations.subject.name.Name}
		 */
		firstName: null,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.relations.subject.CustomContainer} Родительский контейнер данных.
		 */
		_container: null,

		/**
		 * Автоматическое заполнение стандартного написания при помощи значений из ФИО.
		 */
		autoValue: function ()
		{
			var me = this,
				names = me.getNames(),
				titleMain,
				value;

			if (me.autoFilled)
			{
				value = names.first ? names.first + ' ' : '';
				value += names.middle ? names.middle + ' ' : '';
				value += names.last ? names.last : '';
				value = value.trim();

				titleMain = me.getTitleMain();
				titleMain.setRawValue(value);
				titleMain.checkChangeCls();
			}
		},

		/**
		 * Возвращает ФИО.
		 * @return {Object}
		 */
		getNames: function ()
		{
			var me = this,
				val = {};

			val.last = me.getLastName().getValue();
			val.middle = me.getMiddleName().getValue();
			val.first = me.getFirstName().getValue();

			return val;
		},

		getLastName: function ()
		{
			var me = this,
				lastName;

			lastName = me.lastName ||
			           me.up('desc-fieldcontainer').up('desc-fieldcontainer').
						down('[name="relations-subject-last-name"]');

			return lastName;
		},

		getMiddleName: function ()
		{
			var me = this,
				middleName;

			middleName = me.middleName ||
			           me.up('desc-fieldcontainer').up('desc-fieldcontainer').
				           down('[name="relations-subject-middle-name"]');

			return middleName;
		},

		getFirstName: function ()
		{
			var me = this,
				firstName;

			firstName = me.firstName ||
			           me.up('desc-fieldcontainer').up('desc-fieldcontainer').
				           down('[name="relations-subject-first-name"]');

			return firstName;
		},

		getTitleMain: function ()
		{
			var me = this,
				titleMain;

			titleMain = me.titleMain || me.down('[name="' + me.name + '-main"]');

			return titleMain;
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