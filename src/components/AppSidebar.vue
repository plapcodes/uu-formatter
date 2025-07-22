<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Icon } from '@iconify/vue';
</script>

<template>
  <Sidebar variant="sidebar" collapsible="icon">
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <RouterLink to="/">
                <SidebarMenuButton tooltip="Editor">
                  <Icon icon="heroicons:pencil-square" />
                  <span>Editor</span>
                </SidebarMenuButton>
              </RouterLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <RouterLink to="/about">
                <SidebarMenuButton tooltip="About">
                  <Icon icon="heroicons:at-symbol" />
                  <span>About</span>
                </SidebarMenuButton>
              </RouterLink>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <a href="https://github.com/plapcodes/uu-formatter" target="_blank">
        <SidebarMenuButton tooltip="Source Code">
          <Icon icon="mdi:github" />
          <span>Source Code</span>
        </SidebarMenuButton>
      </a>
    </SidebarFooter>
  </Sidebar>
</template>
