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
			var me = this,
				view = me.getView(),
				radio = FBEditor.view.form.desc.relations.subject.radio.Radio;

			//console.log('reset', radio.numberGroup, view);

			me.callParent(arguments);
		},

		/**
		 * Отмечает радиобатон списка при его изменении.
		 */
		onChangeList: function ()
		{
			var me= this,
				view = me.getView(),
				customContainer = view.getCustomContainer(),
				radio = view.getRadio(),
				list = view.getList(),
				viewer,
				listVal,
				listData;

			// отмечаем радиобатон
			radio = radio.child('[reference=linkRadioOther]');
			radio.setValue(true);

			listVal = list.getValue();

			if (listVal)
			{
				// получаем данные выбранной записи
				listData = list.findRecordByValue(listVal).getData();

				// устанавдиваем тип связи в краткой сводке
				viewer = customContainer.getCustomViewer();
				viewer.fireEvent('setLink', listData.name);
			}
		}
	}
);