import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import type {
  ExternalLink,
  FilterCategory,
  MealItem,
  NoteItem,
  PlanBItem,
  TimelineItem,
  TravelFlag,
  TripDay,
} from '../types'
import { SectionCard } from './SectionCard'

const flagOptions: Array<{ label: string; value: TravelFlag | '' }> = [
  { label: '未指定', value: '' },
  { label: 'Important', value: 'important' },
  { label: 'Must do', value: 'must-do' },
  { label: 'Must buy', value: 'must-buy' },
  { label: 'Attention', value: 'attention' },
]

type TimelineCollection = 'transportation' | 'itinerary'
type LinkHostCollection = TimelineCollection | 'meals' | 'notes' | 'planB' | 'links'

const linkTypeOptions: ExternalLink['type'][] = ['map', 'status', 'ticket', 'station', 'info']

interface EditModePanelProps {
  day: TripDay
  onDayChange: (field: keyof TripDay, value: string | string[]) => void
  onTimelineChange: (
    collection: TimelineCollection,
    itemId: string,
    field: keyof TimelineItem,
    value: string | boolean | FilterCategory | TravelFlag | undefined,
  ) => void
  onMealChange: (
    itemId: string,
    field: keyof MealItem,
    value: string | boolean | TravelFlag | undefined,
  ) => void
  onNoteChange: (itemId: string, field: keyof NoteItem, value: string | TravelFlag | undefined) => void
  onPlanBChange: (itemId: string, field: keyof PlanBItem, value: string) => void
  onDayLinkChange: (
    linkId: string,
    field: keyof ExternalLink,
    value: string,
  ) => void
  onItemLinkChange: (
    collection: Exclude<LinkHostCollection, 'links'>,
    itemId: string,
    linkId: string,
    field: keyof ExternalLink,
    value: string,
  ) => void
  onAddTimelineItem: (collection: TimelineCollection) => void
  onAddMeal: () => void
  onAddNote: () => void
  onAddPlanB: () => void
  onAddDayLink: () => void
  onAddItemLink: (collection: Exclude<LinkHostCollection, 'links'>, itemId: string) => void
  onDeleteItem: (
    collection: TimelineCollection | 'meals' | 'notes' | 'planB',
    itemId: string,
  ) => void
  onDeleteDayLink: (linkId: string) => void
  onDeleteItemLink: (
    collection: Exclude<LinkHostCollection, 'links'>,
    itemId: string,
    linkId: string,
  ) => void
  onMoveItem: (
    collection: TimelineCollection | 'meals' | 'notes' | 'planB',
    index: number,
    direction: 'up' | 'down',
  ) => void
}

function EditorActions({
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex gap-2">
      <button onClick={onMoveUp} className="rounded-full border border-ink/10 p-2 text-ink/60">
        <ArrowUp size={14} />
      </button>
      <button onClick={onMoveDown} className="rounded-full border border-ink/10 p-2 text-ink/60">
        <ArrowDown size={14} />
      </button>
      <button onClick={onDelete} className="rounded-full border border-red-200 p-2 text-red-500">
        <Trash2 size={14} />
      </button>
    </div>
  )
}

function LinkEditor({
  links,
  onAdd,
  onChange,
  onDelete,
}: {
  links?: ExternalLink[]
  onAdd: () => void
  onChange: (linkId: string, field: keyof ExternalLink, value: string) => void
  onDelete: (linkId: string) => void
}) {
  return (
    <div className="space-y-3 rounded-3xl border border-dashed border-ink/10 bg-white/70 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-ink/70">Links</div>
        <button
          onClick={onAdd}
          className="rounded-full border border-sage/20 bg-sage/10 px-3 py-1.5 text-xs font-medium text-sage"
        >
          <Plus size={14} className="mr-1 inline" />
          新增 Link
        </button>
      </div>

      {links && links.length > 0 ? (
        <div className="space-y-3">
          {links.map((link) => (
            <div key={link.id} className="grid gap-3 rounded-2xl border border-ink/10 bg-sand/50 p-3 md:grid-cols-4">
              <input
                value={link.label}
                onChange={(event) => onChange(link.id, 'label', event.target.value)}
                placeholder="按鈕文案"
                className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none"
              />
              <select
                value={link.type}
                onChange={(event) => onChange(link.id, 'type', event.target.value)}
                className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none"
              >
                {linkTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <input
                value={link.url}
                onChange={(event) => onChange(link.id, 'url', event.target.value)}
                placeholder="https://..."
                className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none md:col-span-2"
              />
              <div className="md:col-span-4">
                <button
                  onClick={() => onDelete(link.id)}
                  className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500"
                >
                  <Trash2 size={14} className="mr-1 inline" />
                  刪除 Link
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-ink/45">目前沒有 links。</div>
      )}
    </div>
  )
}

export function EditModePanel({
  day,
  onDayChange,
  onTimelineChange,
  onMealChange,
  onNoteChange,
  onPlanBChange,
  onDayLinkChange,
  onItemLinkChange,
  onAddTimelineItem,
  onAddMeal,
  onAddNote,
  onAddPlanB,
  onAddDayLink,
  onAddItemLink,
  onDeleteItem,
  onDeleteDayLink,
  onDeleteItemLink,
  onMoveItem,
}: EditModePanelProps) {
  return (
    <SectionCard title="Admin / Edit Mode" subtitle="直接改資料，不是只改畫面">
      <div className="space-y-6">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-ink/70">Day 標題</span>
            <input
              value={day.title}
              onChange={(event) => onDayChange('title', event.target.value)}
              className="w-full rounded-2xl border border-ink/10 bg-sand/60 px-3 py-2 outline-none"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-ink/70">日期</span>
            <input
              value={day.date}
              onChange={(event) => onDayChange('date', event.target.value)}
              className="w-full rounded-2xl border border-ink/10 bg-sand/60 px-3 py-2 outline-none"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-ink/70">星期</span>
            <input
              value={day.weekday}
              onChange={(event) => onDayChange('weekday', event.target.value)}
              className="w-full rounded-2xl border border-ink/10 bg-sand/60 px-3 py-2 outline-none"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-ink/70">城市</span>
            <input
              value={day.city}
              onChange={(event) => onDayChange('city', event.target.value)}
              className="w-full rounded-2xl border border-ink/10 bg-sand/60 px-3 py-2 outline-none"
            />
          </label>
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block font-medium text-ink/70">天氣</span>
            <input
              value={day.weather}
              onChange={(event) => onDayChange('weather', event.target.value)}
              className="w-full rounded-2xl border border-ink/10 bg-sand/60 px-3 py-2 outline-none"
            />
          </label>
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block font-medium text-ink/70">住宿</span>
            <input
              value={day.hotel}
              onChange={(event) => onDayChange('hotel', event.target.value)}
              className="w-full rounded-2xl border border-ink/10 bg-sand/60 px-3 py-2 outline-none"
            />
          </label>
          <label className="text-sm md:col-span-4">
            <span className="mb-1 block font-medium text-ink/70">Summary</span>
            <textarea
              value={day.summary}
              onChange={(event) => onDayChange('summary', event.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-ink/10 bg-sand/60 px-3 py-2 outline-none"
            />
          </label>
          <label className="text-sm md:col-span-4">
            <span className="mb-1 block font-medium text-ink/70">Tags（逗號分隔）</span>
            <input
              value={day.tags.join(', ')}
              onChange={(event) =>
                onDayChange(
                  'tags',
                  event.target.value
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                )
              }
              className="w-full rounded-2xl border border-ink/10 bg-sand/60 px-3 py-2 outline-none"
            />
          </label>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-ink">Day-level Links</h3>
          </div>
          <LinkEditor
            links={day.links}
            onAdd={onAddDayLink}
            onChange={onDayLinkChange}
            onDelete={onDeleteDayLink}
          />

          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-ink">交通 / 行程項目</h3>
            <div className="flex gap-2">
              <button
                onClick={() => onAddTimelineItem('transportation')}
                className="rounded-full border border-sage/20 bg-sage/10 px-4 py-2 text-sm font-medium text-sage"
              >
                <Plus size={16} className="mr-1 inline" />
                新增交通
              </button>
              <button
                onClick={() => onAddTimelineItem('itinerary')}
                className="rounded-full border border-pine/20 bg-pine/10 px-4 py-2 text-sm font-medium text-pine"
              >
                <Plus size={16} className="mr-1 inline" />
                新增行程
              </button>
            </div>
          </div>

          {(['transportation', 'itinerary'] as const).map((collection) => (
            <div key={collection} className="space-y-3">
              <div className="text-sm font-semibold text-ink/70">
                {collection === 'transportation' ? '交通' : '行程'}
              </div>
              {day[collection].map((item, index) => (
                <div key={item.id} className="rounded-3xl border border-ink/10 bg-sand/60 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-semibold text-ink">{item.title || '未命名項目'}</div>
                    <EditorActions
                      onMoveUp={() => onMoveItem(collection, index, 'up')}
                      onMoveDown={() => onMoveItem(collection, index, 'down')}
                      onDelete={() => onDeleteItem(collection, item.id)}
                    />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <input
                      value={item.time}
                      onChange={(event) => onTimelineChange(collection, item.id, 'time', event.target.value)}
                      placeholder="開始時間"
                      className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none"
                    />
                    <input
                      value={item.endTime ?? ''}
                      onChange={(event) => onTimelineChange(collection, item.id, 'endTime', event.target.value || undefined)}
                      placeholder="結束時間"
                      className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none"
                    />
                    <select
                      value={item.category}
                      onChange={(event) =>
                        onTimelineChange(collection, item.id, 'category', event.target.value as FilterCategory)
                      }
                      className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none"
                    >
                      <option value="transport">交通</option>
                      <option value="activity">景點 / 行程</option>
                      <option value="shopping">購物</option>
                      <option value="ticket">票券</option>
                      <option value="stay">住宿</option>
                      <option value="note">備註</option>
                    </select>
                    <select
                      value={item.flag ?? ''}
                      onChange={(event) =>
                        onTimelineChange(collection, item.id, 'flag', (event.target.value || undefined) as TravelFlag | undefined)
                      }
                      className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none"
                    >
                      {flagOptions.map((option) => (
                        <option key={option.label} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <input
                      value={item.title}
                      onChange={(event) => onTimelineChange(collection, item.id, 'title', event.target.value)}
                      placeholder="標題"
                      className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none md:col-span-2"
                    />
                    <input
                      value={item.bookingReference ?? ''}
                      onChange={(event) =>
                        onTimelineChange(collection, item.id, 'bookingReference', event.target.value || undefined)
                      }
                      placeholder="預約號 / 票號"
                      className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none"
                    />
                    <input
                      value={item.seatInfo ?? ''}
                      onChange={(event) =>
                        onTimelineChange(collection, item.id, 'seatInfo', event.target.value || undefined)
                      }
                      placeholder="座位資訊"
                      className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none"
                    />
                    <textarea
                      value={item.description ?? ''}
                      onChange={(event) =>
                        onTimelineChange(collection, item.id, 'description', event.target.value || undefined)
                      }
                      placeholder="描述 / 詳情"
                      rows={2}
                      className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none md:col-span-4"
                    />
                  </div>
                  <div className="mt-4">
                    <LinkEditor
                      links={item.links}
                      onAdd={() => onAddItemLink(collection, item.id)}
                      onChange={(linkId, field, value) =>
                        onItemLinkChange(collection, item.id, linkId, field, value)
                      }
                      onDelete={(linkId) => onDeleteItemLink(collection, item.id, linkId)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-ink">餐飲 / 備註 / Plan B</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onAddMeal}
                className="rounded-full border border-sage/20 bg-sage/10 px-4 py-2 text-sm font-medium text-sage"
              >
                <Plus size={16} className="mr-1 inline" />
                新增餐飲
              </button>
              <button
                onClick={onAddNote}
                className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-medium text-ink/70"
              >
                <Plus size={16} className="mr-1 inline" />
                新增備註
              </button>
              <button
                onClick={onAddPlanB}
                className="rounded-full border border-blossom/20 bg-blossom/15 px-4 py-2 text-sm font-medium text-[#8f5e5e]"
              >
                <Plus size={16} className="mr-1 inline" />
                新增 Plan B
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {day.meals.map((item, index) => (
              <div key={item.id} className="rounded-3xl border border-ink/10 bg-sand/60 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-semibold text-ink">{item.title || '未命名餐飲'}</div>
                  <EditorActions
                    onMoveUp={() => onMoveItem('meals', index, 'up')}
                    onMoveDown={() => onMoveItem('meals', index, 'down')}
                    onDelete={() => onDeleteItem('meals', item.id)}
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <input
                    value={item.time}
                    onChange={(event) => onMealChange(item.id, 'time', event.target.value)}
                    placeholder="時間"
                    className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none"
                  />
                  <input
                    value={item.title}
                    onChange={(event) => onMealChange(item.id, 'title', event.target.value)}
                    placeholder="餐廳 / 餐飲標題"
                    className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none md:col-span-2"
                  />
                  <select
                    value={item.flag ?? ''}
                    onChange={(event) =>
                      onMealChange(item.id, 'flag', (event.target.value || undefined) as TravelFlag | undefined)
                    }
                    className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none"
                  >
                    {flagOptions.map((option) => (
                      <option key={option.label} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <textarea
                    value={item.description ?? ''}
                    onChange={(event) => onMealChange(item.id, 'description', event.target.value || undefined)}
                    placeholder="描述"
                    rows={2}
                    className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none md:col-span-4"
                  />
                </div>
                <div className="mt-4">
                  <LinkEditor
                    links={item.links}
                    onAdd={() => onAddItemLink('meals', item.id)}
                    onChange={(linkId, field, value) =>
                      onItemLinkChange('meals', item.id, linkId, field, value)
                    }
                    onDelete={(linkId) => onDeleteItemLink('meals', item.id, linkId)}
                  />
                </div>
              </div>
            ))}

            {day.notes.map((item, index) => (
              <div key={item.id} className="rounded-3xl border border-ink/10 bg-sand/60 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-semibold text-ink">{item.title || '未命名備註'}</div>
                  <EditorActions
                    onMoveUp={() => onMoveItem('notes', index, 'up')}
                    onMoveDown={() => onMoveItem('notes', index, 'down')}
                    onDelete={() => onDeleteItem('notes', item.id)}
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    value={item.title}
                    onChange={(event) => onNoteChange(item.id, 'title', event.target.value)}
                    placeholder="備註標題"
                    className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none"
                  />
                  <select
                    value={item.flag ?? ''}
                    onChange={(event) =>
                      onNoteChange(item.id, 'flag', (event.target.value || undefined) as TravelFlag | undefined)
                    }
                    className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none"
                  >
                    {flagOptions.map((option) => (
                      <option key={option.label} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <textarea
                    value={item.content}
                    onChange={(event) => onNoteChange(item.id, 'content', event.target.value)}
                    placeholder="備註內容"
                    rows={3}
                    className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none md:col-span-2"
                  />
                </div>
                <div className="mt-4">
                  <LinkEditor
                    links={item.links}
                    onAdd={() => onAddItemLink('notes', item.id)}
                    onChange={(linkId, field, value) =>
                      onItemLinkChange('notes', item.id, linkId, field, value)
                    }
                    onDelete={(linkId) => onDeleteItemLink('notes', item.id, linkId)}
                  />
                </div>
              </div>
            ))}

            {day.planB.map((item, index) => (
              <div key={item.id} className="rounded-3xl border border-ink/10 bg-sand/60 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-semibold text-ink">{item.title || '未命名 Plan B'}</div>
                  <EditorActions
                    onMoveUp={() => onMoveItem('planB', index, 'up')}
                    onMoveDown={() => onMoveItem('planB', index, 'down')}
                    onDelete={() => onDeleteItem('planB', item.id)}
                  />
                </div>
                <div className="grid gap-3">
                  <input
                    value={item.title}
                    onChange={(event) => onPlanBChange(item.id, 'title', event.target.value)}
                    placeholder="Plan B 標題"
                    className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none"
                  />
                  <textarea
                    value={item.content}
                    onChange={(event) => onPlanBChange(item.id, 'content', event.target.value)}
                    placeholder="Plan B 內容"
                    rows={3}
                    className="rounded-2xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div className="mt-4">
                  <LinkEditor
                    links={item.links}
                    onAdd={() => onAddItemLink('planB', item.id)}
                    onChange={(linkId, field, value) =>
                      onItemLinkChange('planB', item.id, linkId, field, value)
                    }
                    onDelete={(linkId) => onDeleteItemLink('planB', item.id, linkId)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
