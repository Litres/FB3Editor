/**
 * Контроллер родительского контейнера каждой серии.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.sequence.item.SequenceItemController',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldController',
		alias: 'controller.form.desc.sequence.item',

		onAccessHub: function ()
		{
			var me = this,
				view = me.getView(),
				values = view.getValues();

			if (!values)
			{
				// показываем поля поиска
				view.switchContainers(true);
			}
		},

		/**
		 * Вкладывает новые поля в родительский контейнер.
		 *
		 * @param {Object} data Данные.
		 */
		onPutData:  function (data)
		{
			var me = this,
				view = me.getView(),
				plugin = view.getPlugin('fieldcontainerreplicator'),
				sequenceContainer = view.getSequenceContainer();

			data = data[0] ? data : {0: data};
			sequenceContainer.setValues(data, plugin);
		},

		/**
		 * Вызывается при добавлении нового контейнера серии.
		 */
		onAddFields: function ()
		{
			//
		},

		/**
		 * Делает актвиной кнопку вложения.
		 */
		onRemoveFields: function ()
		{
			var me = this,
				view = me.getView(),
				plugin = view.getPlugin('fieldcontainerreplicator'),
				btn;

			if (plugin)
			{
				btn = plugin.getBtnPut();
				btn.enable();
			}
		},

		/**
		 * Вызывается при добавлении вложенной секции.
		 * Удаляет кнопку добавления полей у вложенной серии и деактивирует кнопку вложения у родительской серии.
		 * @param {Ext.button.Button} ownerBtn Кнопка вложения родительской серии.
		 */
		onPutFields: function (ownerBtn)
		{
			var me = this,
				view = me.getView(),
				plugin = view.getPlugin('fieldcontainerreplicator'),
				btn;

			ownerBtn.disable();
			btn = plugin.getBtnAdd();
			btn.ownerCt.remove(btn);
		},

		/**
		 * Сбрасывает данные.
		 */
		onResetContainer: function ()
		{
			var me = this,
				view = me.getView();

			// показываем поля данных или поле поиска, если доступен хаб
			view.switchContainers();
		}
	}
);