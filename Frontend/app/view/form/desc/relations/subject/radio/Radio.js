/**
 * Группа радиобатонов для выбора типа связи персоны.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.radio.Radio',
	{
		extend: 'Ext.form.RadioGroup',
		requires: [
			'FBEditor.view.form.desc.relations.subject.radio.RadioController'
		],

		xtype: 'relations-subject-link-radio',
		controller: 'form.desc.relations.subject.link.radio',

		listeners: {
			change: 'onChange',
			loadData: 'onLoadData'
		},
		
		_container: null,

		statics:
		{
			/**
			 * @property {Number} Номер группы радиобатонов.
			 */
			numberGroup: 0
		},

		allowBlank: false,

		defaults:
		{
			keyEnterAsTab: true
		},

		translateText: {
			author: 'Автор',
			publisher: 'Издатель',
			translator: 'Переводчик'
		},

		initComponent: function ()
		{
			var me = this,
				numberGroup = me.self.numberGroup;

			me.name = 'relations-subject-link-radio-' + numberGroup;

			//console.log('init', me.name);

			me.items = [
				{
					name: 'rel-subject-link-' + numberGroup,
					inputValue: 'author',
					boxLabel: me.translateText.author,
					checked: true,
					margin: '0 20 0 0'
				},
				{
					name: 'rel-subject-link-' + numberGroup,
					inputValue: 'translator',
					boxLabel: me.translateText.translator,
					margin: '0 20 0 0'
				},
				{
					name: 'rel-subject-link-' + numberGroup,
					inputValue: 'publisher',
					boxLabel: me.translateText.publisher,
					margin: '0 20 0 0'
				},
				{
					name: 'rel-subject-link-' + numberGroup,
					inputValue: 'other-list',
					reference: 'linkRadioOther'
				}
			];

			numberGroup++;
			me.self.numberGroup = numberGroup;

			me.callParent(arguments);
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