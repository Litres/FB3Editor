/**
 * Контроллер типа связи.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.LinkController',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldController',
		alias: 'controller.form.desc.relations.subject.link',

		onResetFields: function ()
		{
			var me = this;

			FBEditor.view.form.desc.relations.subject.radio.Radio.numberGroup = 1;
			me.callParent(arguments);
		},

		/**
		 * Отмечает радиобаттон списка при его изменении.
		 */
		onChangeList: function ()
		{
			var me= this,
				view = me.getView(),
				radio;

			radio = view.lookupReference('linkRadioOther');
			radio.setValue(true);
		}
	}
);