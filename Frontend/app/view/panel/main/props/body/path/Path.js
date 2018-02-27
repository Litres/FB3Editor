/**
 * Путь элемента в модели.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.path.Path',
	{
		extend: 'Ext.Container',
		requires: [
			'FBEditor.view.panel.main.props.body.path.el.El'
		],

		id: 'panel-props-body-path',
		xtype: 'panel-props-body-path',

		margin: '0 0 10px 0',

		defaults: {
			style: {
				float: 'left'
			}
		},

		/**
		 * Обновляет путь.
		 * @param {FBEditor.editor.element.AbstractElement} focusEl Элемент, от которого строится путь до
		 * корневого элемента.
		 */
		updateData: function (focusEl)
		{
			var me = this,
				parent = focusEl,
				splitter,
				el;

			me.resetData();
			
			splitter = {
				xtype: 'component',
				html: '&nbsp;>&nbsp;'
			};
			
			while (parent && !parent.isRoot)
			{
				if (parent.equal(focusEl))
				{
					// фокусный элемент пути не должен быть активен
					el = {
						xtype: 'component',
						html: parent.getName().toUpperCase()
					}
				}
				else
				{
					// создаем элемент пути
					el = Ext.create('FBEditor.view.panel.main.props.body.path.el.El', {focusEl: parent});
				}

				// вставляем в начало пути
				me.insert(0, el);
				
				parent = parent.parent;

				if (parent && !parent.isRoot)
				{
					// вставляем разделитель
					me.insert(0, splitter);
				}
			}
		},

		/**
		 * Сбрасывает путь.
		 */
		resetData: function ()
		{
			var me = this;
			
			me.removeAll(true, true);
		}
	}
);