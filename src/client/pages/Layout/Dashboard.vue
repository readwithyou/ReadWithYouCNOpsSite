<template>
  <div class="content">
    <div class="md-layout">
      <can I="read" a="statistics">
        <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25">
          <stats-card theme="red">
            <template slot="header">
              <md-icon class="md-size-3x" id="stats-cards-icon">ballot</md-icon>
            </template>

            <template slot="content">
              <div class="md-title">{{ statistics.registrations }}</div>
              <div class="md-subhead">{{ $t('message.registrations') }}</div>
            </template>

            <template slot="footer">
              <div class="stats">
                  <md-icon id="stats-cards-icon">date_range</md-icon>
                  {{ statistics.time?new Date(statistics.time).toLocaleString():'' }}
              </div>
            </template>
          </stats-card>
        </div>
        <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25">
          <stats-card theme="blue">
            <template slot="header">
              <md-icon class="md-size-3x" id="stats-cards-icon">person_outline</md-icon>
            </template>

            <template slot="content">
              <div class="md-title">{{ statistics.students }}</div>
              <div class="md-subhead">{{$t('message.student')}}</div>
            </template>

            <template slot="footer">
              <div class="stats">
                  <md-icon id="stats-cards-icon">date_range</md-icon>
                  {{ statistics.time?new Date(statistics.time).toLocaleString():'' }}
              </div>
            </template>
          </stats-card>
        </div>
        <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25">
          <stats-card theme="orange">
            <template slot="header">
              <md-icon class="md-size-3x" id="stats-cards-icon">supervisor_account</md-icon>
            </template>

            <template slot="content">
              <div class="md-title">{{ statistics.teachers }}</div>
              <div class="md-subhead">{{ $t('message.teacher') }}</div>
            </template>

            <template slot="footer">
              <div class="stats">
                  <md-icon id="stats-cards-icon">date_range</md-icon>
                  {{ statistics.time?new Date(statistics.time).toLocaleString():'' }}
              </div>
            </template>
          </stats-card>
        </div>
        <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25">
          <stats-card theme="green">
            <template slot="header">
              <md-icon class="md-size-3x" id="stats-cards-icon">collections_bookmark</md-icon>
            </template>

            <template slot="content">
              <div class="md-title">{{ statistics.books }}</div>
              <div class="md-subhead">{{ $t('message.book') }}</div>
            </template>

            <template slot="footer">
              <div class="stats">
                  <md-icon id="stats-cards-icon">date_range</md-icon>
                  Until Sep 07 11:17PM
              </div>
            </template>
          </stats-card>
        </div>
      </can>
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <nav-tabs-card>
          <template slot="content">
            <span class="md-subheading">{{ $t('message.pending_tasks') }}</span>
            <md-tabs md-sync-route class="md-success" md-alignment="left">

              <md-tab id="tab-home" :md-label="$t('message.pending_registrations')" md-icon="ballot" v-if="$can('read', 'pendingRegistrations')">
                <pending-registrations-table></pending-registrations-table>
              </md-tab>

              <md-tab id="tab-pages" :md-label="$t('message.pending_book_list')" md-icon="book" v-if="$can('read', 'pendingBookList')">
                <pending-book-list-table></pending-book-list-table>
              </md-tab>

              <md-tab id="tab-posts" :md-label="$t('message.my_tickets')" md-icon="receipt" v-if="$can('read', 'myTickets')">
                <my-tickets-table></my-tickets-table>
              </md-tab>
            </md-tabs>
          </template>
        </nav-tabs-card>
      </div>
    </div>
  </div>
</template>

<script>
import { Can } from "@casl/vue";
import { StatsCard, NavTabsCard } from "components";

import {
  PendingRegistrationsTable,
  PendingBookListTable,
  MyTicketsTable
} from "pages";

export default {
  components: {
    Can,
    StatsCard,
    NavTabsCard,
    PendingRegistrationsTable,
    PendingBookListTable,
    MyTicketsTable
  },
  data() {
    return {
      statistics: {
        students: 98,
        teachers: 25,
        books: 707,
        registrations: 47,
        time: 1536403090000
      }
    };
  }
};
</script>

<style lang="scss" scoped>
#stats-cards-icon {
  color: #eceff1;
}
</style>

